import { HttpException, HttpStatus } from '@nestjs/common';

export class MyException extends HttpException {
  constructor(
    message: string,
    status: number = HttpStatus.BAD_REQUEST,
    public readonly code: number = 0,
  ) {
    super(message, status);
  }
}
