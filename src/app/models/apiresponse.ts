export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data?: T;
}
