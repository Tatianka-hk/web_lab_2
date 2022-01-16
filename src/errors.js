export class MyError extends Error {
  constructor(message = "", status = 400) {
    super(message);
    this.status = status;
  }

  static RateLimitError() {
    return new MyError("Too many requests", 429);
  }

  static ValidationError(desc) {
    return new MyError("Validation Error: " + desc, 400);
  }

  static MailError() {
    return new MyError("Failed to send message ", 500);
  }
}
