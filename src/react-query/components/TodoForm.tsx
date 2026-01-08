import { FormEvent, useRef } from "react";

interface TodoFormProps {
  isSubmitting?: boolean;
  onAdd: (title: string) => Promise<void> | void;
}

const TodoForm = ({ isSubmitting = false, onAdd }: TodoFormProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const value = ref.current?.value.trim();
    if (!value) return;

    await onAdd(value);
    if (ref.current) ref.current.value = "";
  };

  return (
    <form className="row mb-3" onSubmit={handleSubmit}>
      <div className="col">
        <input
          ref={ref}
          type="text"
          className="form-control"
          placeholder="Enter a todo title"
          disabled={isSubmitting}
        />
      </div>
      <div className="col-auto">
        <button className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
