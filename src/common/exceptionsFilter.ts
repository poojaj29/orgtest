import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  RpcExceptionFilter
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';
    switch (exception.constructor) {
      case HttpException:
        httpStatus = (exception as HttpException).getStatus();
        message = exception?.message || 'Internal server error';
        break;
      case RpcException:
        httpStatus = exception?.code || exception?.error?.code || HttpStatus.BAD_REQUEST;
        message = exception?.message;
        break;
      default:
        httpStatus = exception.response?.status || exception.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        message =
          exception.response?.data?.message ||
          exception.response?.message ||
          exception?.message ||
          'Internal server error';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Logger.error('Exception Filter :', message, (exception as any).stack, `${request.method} ${request.url}`);

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

@Catch(RpcException)
export class CustomExceptionFilter implements RpcExceptionFilter<RpcException> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    throw new RpcException({ message: exception.getError(), code: HttpStatus.BAD_REQUEST });
  }
}
