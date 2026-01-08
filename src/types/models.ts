// API Models
export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Request DTOs (Data Transfer Objects)
export interface CreateTodoDto {
  title: string;
  userId: number;
  completed: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

// Query Parameters
export interface PaginationParams {
  _start?: number;
  _limit?: number;
}

export interface TodosQueryParams extends PaginationParams {
  userId?: number;
}

export interface PostsQueryParams extends PaginationParams {
  userId?: number;
}
