import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/apiClient";
import { Todo } from "../../types/models";
import { queryKeys } from "../queryKeys";

export type { Todo };

export interface UseTodosParams {
  page?: number;
  limit?: number;
  userId?: number;
}

export interface UseTodosResult {
  todos: Todo[];
  totalCount: number;
  page: number;
  pageSize: number;
}

const useTodos = ({ page = 1, limit = 10, userId }: UseTodosParams = {}) =>
  useQuery<UseTodosResult, Error>({
    queryKey: queryKeys.todos.list({ page, limit, userId }),
    queryFn: async () =>
      api.todos
        .getAll({
          _start: (page - 1) * limit,
          _limit: limit,
          ...(userId ? { userId } : {}),
        })
        .then((res) => ({
          todos: res.data,
          totalCount: Number(res.headers["x-total-count"] ?? res.data.length),
          page,
          pageSize: limit,
        })),
  });

export default useTodos;
