import { UseTodosParams } from "./hooks/useTodos";

interface UsePostsParams {
  page?: number;
  limit?: number;
  userId?: number;
}

interface UseInfinitePostsParams {
  limit?: number;
  userId?: number;
}

/**
 * Centralized query key factory for type-safe and consistent query keys
 *
 * Benefits:
 * - Type safety: Prevents typos and ensures correct parameters
 * - Consistency: All query keys follow the same hierarchical structure
 * - Easy refactoring: Change keys in one place
 * - Better invalidation: Easy to target specific queries or groups
 */
export const queryKeys = {
  todos: {
    all: ['todos'] as const,
    lists: () => [...queryKeys.todos.all, 'list'] as const,
    list: (filters: UseTodosParams) =>
      [...queryKeys.todos.lists(), filters] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: UsePostsParams) =>
      [...queryKeys.posts.lists(), filters] as const,
    infinite: (filters: UseInfinitePostsParams) =>
      [...queryKeys.posts.all, 'infinite', filters] as const,
  },
} as const;
