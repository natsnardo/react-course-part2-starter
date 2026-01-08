import { useEffect, useState } from "react";
import useTodos from "../hooks/useTodos";
import useToggleTodo from "../hooks/useToggleTodo";
import { getPaginationItems } from "../../utils/pagination";

const PAGE_SIZE = 10;

interface TodoListProps {
  resetSignal?: number;
}

const TodoList = ({ resetSignal = 0 }: TodoListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isLoading, isFetching } = useTodos({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  const { mutate: toggleTodo } = useToggleTodo();

  useEffect(() => {
    setCurrentPage(1);
  }, [resetSignal]);

  if (isLoading)
    return (
      <ul className="list-group mb-3">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <li
            key={index}
            className="list-group-item d-flex align-items-center"
          >
            <div className="skeleton skeleton-checkbox me-3"></div>
            <div className="flex-grow-1">
              <div
                className={`skeleton skeleton-text ${
                  index % 3 === 0
                    ? "skeleton-line-short"
                    : index % 2 === 0
                    ? "skeleton-line-medium"
                    : "skeleton-line-long"
                }`}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    );

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error.message}
      </div>
    );

  const todos = data?.todos ?? [];
  const totalPages = Math.max(
    1,
    data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1
  );

  const handlePrevious = () => setCurrentPage((page) => Math.max(1, page - 1));
  const handleNext = () =>
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  const handleGoToPage = (page: number) => setCurrentPage(page);

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleTodo({ id, completed: !completed });
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <>
      {isFetching && (
        <div className="alert alert-info py-2" role="status">
          <small>Refreshing...</small>
        </div>
      )}

      {todos.length === 0 && !isFetching ? (
        <div className="alert alert-light text-center py-5">
          <p className="mb-0 text-muted">No todos found</p>
        </div>
      ) : (
        <ul className="list-group mb-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="list-group-item d-flex align-items-center"
            >
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id, todo.completed)}
                aria-label={`Todo: ${todo.title}`}
              />
              <span
                className={todo.completed ? "text-decoration-line-through text-muted" : ""}
              >
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Todo pagination">
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

export default TodoList;
