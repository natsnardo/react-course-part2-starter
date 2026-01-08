import "./App.css";
import { useState, useEffect } from "react";
import InfinitePostList from "./react-query/components/InfinitePostList";
import PostList from "./react-query/components/PostList";
import TodoForm from "./react-query/components/TodoForm";
import TodoList from "./react-query/components/TodoList";
import useAddTodo from "./react-query/hooks/useAddTodo";

function App() {
  const [todoResetSignal, setTodoResetSignal] = useState(0);
  const [todoError, setTodoError] = useState<string | null>(null);
  const { mutateAsync: addTodo, isPending: isAdding } = useAddTodo();

  const handleAddTodo = async (title: string) => {
    try {
      setTodoError(null); // Clear any previous errors
      await addTodo({ title });
      setTodoResetSignal((signal) => signal + 1);
    } catch (error) {
      setTodoError(
        error instanceof Error ? error.message : "Failed to add todo"
      );
    }
  };

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (todoError) {
      const timer = setTimeout(() => {
        setTodoError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [todoError]);

  return (
    <>
      {todoError && (
        <div
          className="alert alert-danger fade show shadow-lg"
          role="alert"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1050,
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <strong>Error:</strong> {todoError}
        </div>
      )}

      <div className="container my-5">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">React Query Demo</h1>
        </header>

        <div className="row g-4 mb-5 justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm">
              <div className="card-header card-header-gradient-primary">
                <h2 className="h5 mb-0">Todo Management</h2>
              </div>
              <div className="card-body">
                <TodoForm isSubmitting={isAdding} onAdd={handleAddTodo} />
                <TodoList resetSignal={todoResetSignal} />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header card-header-gradient-secondary">
                <h2 className="h5 mb-0">Paginated Posts</h2>
              </div>
              <div className="card-body">
                <PostList />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-header card-header-gradient-tertiary">
                <h2 className="h5 mb-0">Infinite Scroll Posts</h2>
              </div>
              <div className="card-body">
                <InfinitePostList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
