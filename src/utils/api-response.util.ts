import { ApiResponse } from '../interfaces/api-response.interface';

export function buildResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string,
): ApiResponse<T> {
  return {
    success,
    message,
    data,
    error,
  };
}
