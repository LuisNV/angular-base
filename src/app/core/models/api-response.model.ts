export interface ApiResponse<T> {
  code: number;
  httpStatus: number;
  message: string;
  data: T;
  traceId: string;
}
