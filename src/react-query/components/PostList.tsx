import { useState } from "react";
import usePosts from "../hooks/usePosts";
import { getPaginationItems } from "../../utils/pagination";

const PAGE_SIZE = 10;
const USER_IDS = Array.from({ length: 10 }, (_, index) => index + 1);

const PostList = () => {
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  const userIdParam = selectedUser === "" ? undefined : selectedUser;
  const { data, error, isLoading, isFetching } = usePosts({
    page: currentPage,
    limit: PAGE_SIZE,
    userId: userIdParam,
  });
  const posts = data?.posts ?? [];
  const totalPages = Math.max(
    1,
    data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1
  );

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
    setCurrentPage(1);
  };

  const handlePrevious = () => setCurrentPage((page) => Math.max(1, page - 1));
  const handleNext = () =>
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  const handleGoToPage = (page: number) => setCurrentPage(page);

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <>
      <div className="mb-3">
        <label htmlFor="userFilter" className="form-label">
          Filter by user
        </label>
        <select
          id="userFilter"
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

      {isFetching && (
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

      {totalPages > 1 && (
        <nav aria-label="Post pagination">
          <ul className="pagination mb-0 justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePrevious}
                aria-label="Previous page"
              >
                Prev
              </button>
            </li>
            {paginationItems.map((item, index) =>
              typeof item === "number" ? (
                <li
                  key={item}
                  className={`page-item ${
                    currentPage === item ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleGoToPage(item)}
                    aria-label={`Go to page ${item}`}
                    aria-current={currentPage === item ? "page" : undefined}
                  >
                    {item}
                  </button>
                </li>
              ) : (
                <li key={`ellipsis-${index}`} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )
            )}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNext}
                aria-label="Next page"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default PostList;
