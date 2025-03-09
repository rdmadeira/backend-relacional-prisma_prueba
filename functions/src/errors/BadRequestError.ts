import CustomError from "./CustomError.js";

export default class BadRequestError extends CustomError {
  statusCode: number = 404;
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
