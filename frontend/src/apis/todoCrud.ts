import apiClient from "./apiClient";
import { TodoType } from "../types/Todo";
import { TodoResponseType, AxiosErrorResponseType } from "../types/TodoResponse";
import { isAxiosError } from "axios";

/**
 * Todo CRUD API
 */

export const getTodos = async () => {
  try {
    // backendのlocalhost:3001/api/v1/todosにGETリクエストを送信
    const response = await apiClient.get<Array<TodoType>>('/todos');
    // responseに明示的に型を付与 dataプロパティがArray<TodoType>であることを保証
    const res: TodoResponseType<Array<TodoType>> = { code: response.status, data: response.data };
    return res;
  } catch (error) {
    const res: TodoResponseType = { code: 500, message: "Unexpected error" };
        if (isAxiosError(error)) { // Axios由来 → response や statusが存在する可能性あり
      const axiosError = error as AxiosErrorResponseType;
      res.code = axiosError.response?.status ?? 500;
      res.message = axiosError.response?.data?.errors?.[0]?.detail ?? "Request failed";
    }
    return res;
  }
};
