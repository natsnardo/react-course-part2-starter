import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/apiClient";
import { Post } from "../../types/models";
import { queryKeys } from "../queryKeys";

export type { Post };

interface UsePostsParams {
  page?: number;
  limit?: number;
  userId?: number;
}

interface UsePostsResult {
  posts: Post[];
  totalCount: number;
}

const usePosts = ({ page = 1, limit = 10, userId }: UsePostsParams = {}) =>
  useQuery<UsePostsResult, Error>({
    queryKey: queryKeys.posts.list({ page, limit, userId }),
    queryFn: async () =>
      api.posts
        .getAll({
          _start: (page - 1) * limit,
          _limit: limit,
          ...(userId ? { userId } : {}),
        })
        .then((res) => ({
          posts: res.data,
          totalCount: Number(res.headers["x-total-count"] ?? res.data.length),
        })),
  });

export default usePosts;
