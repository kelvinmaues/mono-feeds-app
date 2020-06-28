export default class HttpException extends Error {
  statusCode: number;
  message: string;
  error: string | null;
  errors: object | null;

  constructor(
    statusCode: number,
    message: string,
    error?: string,
    errors?: object
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.error = error || null;
    this.errors = errors || null;
  }
}
