import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/apiClient";
import { Todo } from "../../types/models";
import { UseTodosResult } from "./useTodos";
import { queryKeys } from "../queryKeys";

interface ToggleTodoInput {
  id: number;
  completed: boolean;
}

const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, ToggleTodoInput>({
    mutationFn: async ({ id, completed }) =>
      api.todos.update(id, { completed }).then((res) => res.data),
    onMutate: async ({ id, completed }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.all });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueriesData<UseTodosResult>({
        queryKey: queryKeys.todos.all,
      });

      // Optimistically update all todo queries
      queryClient.setQueriesData<UseTodosResult>(
        { queryKey: queryKeys.todos.all },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            todos: oldData.todos.map((todo) =>
              todo.id === id ? { ...todo, completed } : todo
            ),
          };
        }
      );

      // Return context with snapshot
      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        context.previousTodos.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // Note: onSettled with invalidateQueries removed because JSONPlaceholder is a mock API
    // that doesn't persist changes. The optimistic update in onMutate is sufficient.
    // In a real app with a real backend, you would uncomment this to refetch:
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: queryKeys.todos.all });
    // },
  });
};

export default useToggleTodo;
