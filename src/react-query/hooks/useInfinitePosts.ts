import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../api/apiClient";
import { Post } from "../../types/models";
import { queryKeys } from "../queryKeys";

interface UseInfinitePostsParams {
  limit?: number;
  userId?: number;
}

const useInfinitePosts = ({
  limit = 10,
  userId,
}: UseInfinitePostsParams = {}) =>
  useInfiniteQuery<Post[], Error, Post[], ReturnType<typeof queryKeys.posts.infinite>, number>({
    queryKey: queryKeys.posts.infinite({ limit, userId }),
    queryFn: async ({ pageParam = 0 }) =>
      api.posts
        .getAll({
          _start: pageParam,
          _limit: limit,
          ...(userId ? { userId } : {}),
        })
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length * limit,
  });

export default useInfinitePosts;
