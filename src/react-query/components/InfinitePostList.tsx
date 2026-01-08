import { useState } from "react";
import useInfinitePosts from "../hooks/useInfinitePosts";

const PAGE_SIZE = 10;
const USER_IDS = Array.from({ length: 10 }, (_, index) => index + 1);

const InfinitePostList = () => {
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const userIdParam = selectedUser === "" ? undefined : selectedUser;

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfinitePosts({ limit: PAGE_SIZE, userId: userIdParam });

  if (isLoading)
    return (
      <>
        <div className="mb-3">
          <div className="skeleton skeleton-text" style={{ width: "100px" }}></div>
          <div className="skeleton" style={{ height: "38px", marginTop: "8px" }}></div>
        </div>
        <ul className="list-group mb-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <li key={index} className="list-group-item">
              <div className="skeleton skeleton-title skeleton-line-medium mb-2"></div>
              <div className="skeleton skeleton-text skeleton-line-long"></div>
            </li>
          ))}
        </ul>
      </>
    );

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error.message}
      </div>
    );

  const handleSelectUser = (value: string) => {
    setSelectedUser(value === "" ? "" : Number(value));
  };

  const posts = data?.pages.flat() ?? [];

  return (
    <>
      <div className="mb-3">
        <label htmlFor="userFilterInfinite" className="form-label">
          Filter by user
        </label>
        <select
          id="userFilterInfinite"
          className="form-select"
          value={selectedUser}
          onChange={(event) => handleSelectUser(event.target.value)}
        >
          <option value="">All users</option>
          {USER_IDS.map((userId) => (
            <option key={userId} value={userId}>
              User {userId}
            </option>
          ))}
        </select>
      </div>

      {isFetching && !isFetchingNextPage && (
        <div className="alert alert-info py-2" role="status">
          <small>Refreshing...</small>
        </div>
      )}

      {posts.length === 0 && !isFetching ? (
        <div className="alert alert-light text-center py-5">
          <p className="mb-0 text-muted">No posts found</p>
        </div>
      ) : (
        <ul className="list-group mb-3">
          {posts.map((post) => (
            <li key={post.id} className="list-group-item">
              <h6 className="mb-1">{post.title}</h6>
              <small className="text-muted">
                {post.body.substring(0, 80)}
                {post.body.length > 80 ? "..." : ""}
              </small>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-center">
        <button
          className="btn btn-primary"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </>
          ) : hasNextPage ? (
            "Load more"
          ) : (
            "No more posts"
          )}
        </button>
      </div>
    </>
  );
};

export default InfinitePostList;
