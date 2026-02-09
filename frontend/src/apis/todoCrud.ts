import apiClient from "./apiClient";
import { TodoType } from "../types/Todo";

/**
 * Todo CRUD API
 */

export const getTodos = async () => {
  // backendのlocalhost:3001/api/v1/todosにGETリクエストを送信
  const response = await apiClient.get<Array<TodoType>>('/todos');
  return response.data;
};
