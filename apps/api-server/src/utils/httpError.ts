/**
 * An error that carries an HTTP status code.
 * Throw it from services; the global error handler turns it into a response.
 */
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}
