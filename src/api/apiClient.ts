import axios from "axios";
import {
  Todo,
  Post,
  CreateTodoDto,
  UpdateTodoDto,
  TodosQueryParams,
  PostsQueryParams,
} from "../types/models";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Axios instance configured for JSONPlaceholder API
 *
 * Note: For production apps with real backends, consider adding:
 * - Request/response interceptors for auth tokens
 * - Error handling interceptors
 * - Request timeout configuration
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints organized by resource with TypeScript generics
export const api = {
  todos: {
    getAll: (params?: TodosQueryParams) =>
      apiClient.get<Todo[]>("/todos", { params }),

    create: (data: CreateTodoDto) => apiClient.post<Todo>("/todos", data),

    update: (id: number, data: UpdateTodoDto) =>
      apiClient.patch<Todo>(`/todos/${id}`, data),

    delete: (id: number) => apiClient.delete<void>(`/todos/${id}`),
  },

  posts: {
    getAll: (params?: PostsQueryParams) =>
      apiClient.get<Post[]>("/posts", { params }),

    getById: (id: number) => apiClient.get<Post>(`/posts/${id}`),
  },
};
