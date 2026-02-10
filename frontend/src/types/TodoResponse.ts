export interface TodoResponseType<T = undefined> {
  code: number;
  message?: string;
  data?: T;
}

export type ApiErrorBody = {
  errors: Array<{
    status: string;
    title: string;
    detail: string;
    code?: string;
    source?: { pointer: string };
  }>;
};

export type AxiosErrorResponseType = {
  message: string;
  response?: {
    status: number;
    data?: ApiErrorBody;
  };
};
