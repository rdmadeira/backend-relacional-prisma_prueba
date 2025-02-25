import CustomError from "./CustomError.js";

export default class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: this.msg,
      },
    ];
  }
}
