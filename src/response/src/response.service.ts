import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  success: boolean;
  code: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public response(message: string, success: boolean, data?: any, code?: number): ResponseService {
    const response: ResponseService = new ResponseService();
    response.message = message;
    response.data = data;
    response.success = success;
    response.code = code || 500;
    return response;
  }
}
