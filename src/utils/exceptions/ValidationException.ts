import HttpException from "./HttpException";

class ValidationException extends HttpException {
  constructor(message: string) {
    super(400, message);
  }
}

export default ValidationException;
