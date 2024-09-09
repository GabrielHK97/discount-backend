import { HttpStatus } from '@nestjs/common';

interface Metadata<T> {
  message: string;
  data: T;
}

export class ServiceData<T = void> {
  status: HttpStatus;
  message: string;
  data: T;

  constructor(status: HttpStatus, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  getMetadata(): Metadata<T> {
    return { message: this.message, data: this.data };
  }
}