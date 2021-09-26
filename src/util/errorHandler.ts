export interface ErrnoException extends Error {
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
    status?: number;
}

export class ErrorMessage extends Error {
    status: number;
    message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}