import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/apiClient";
import { Todo } from "../../types/models";
import { UseTodosResult } from "./useTodos";
import { queryKeys } from "../queryKeys";

interface NewTodoInput {
  title: string;
  userId?: number;
}

interface AddTodoContext {
  previousTodos: [QueryKey, UseTodosResult | undefined][];
  optimisticTodoId: number;
}

// Counter for optimistic todo IDs (starts at 201 to match JSONPlaceholder's response)
let optimisticIdCounter = 201;

const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, NewTodoInput, AddTodoContext>({
    mutationFn: async ({ title, userId = 1 }) =>
      api.todos
        .create({ title, userId, completed: false })
        .then((res) => res.data),

    onMutate: async ({ title, userId = 1 }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.all });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueriesData<UseTodosResult>({
        queryKey: queryKeys.todos.all,
      });

      // Generate unique optimistic ID (201, 202, 203, etc.)
      // JSONPlaceholder always returns 201, so we use incrementing IDs to avoid React key collisions
      const optimisticTodoId = optimisticIdCounter++;
      const optimisticTodo: Todo = {
        id: optimisticTodoId,
        title,
        userId,
        completed: false,
      };

      // Optimistically update all todo queries on page 1
      queryClient.setQueriesData<UseTodosResult>(
        { queryKey: queryKeys.todos.all },
        (oldData) => {
          if (!oldData) return oldData;

          // Only add to page 1
          if (oldData.page === 1) {
            return {
              ...oldData,
              todos: [optimisticTodo, ...oldData.todos].slice(
                0,
                oldData.pageSize
              ),
              totalCount: oldData.totalCount + 1,
            };
          }

          // Other pages just update count
          return {
            ...oldData,
            totalCount: oldData.totalCount + 1,
          };
        }
      );

      // Return context with snapshot and optimistic ID
      return { previousTodos, optimisticTodoId };
    },

    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSuccess: (newTodo, _variables, context) => {
      // Update optimistic todo with server response BUT keep our unique optimistic ID
      // JSONPlaceholder always returns id 201, causing duplicate key errors
      // So we keep the optimistic ID and merge other fields from server
      queryClient.setQueriesData<UseTodosResult>(
        { queryKey: queryKeys.todos.all },
        (oldData) => {
          if (!oldData || oldData.page !== 1) return oldData;

          return {
            ...oldData,
            todos: oldData.todos.map((todo) =>
              todo.id === context?.optimisticTodoId
                ? { ...newTodo, id: context.optimisticTodoId } // Keep optimistic ID!
                : todo
            ),
          };
        }
      );
    },
  });
};

export default useAddTodo;
