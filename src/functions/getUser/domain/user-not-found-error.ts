class UserNotFoundError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export default UserNotFoundError;
