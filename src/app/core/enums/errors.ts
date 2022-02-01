export enum Errors {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export function ErrorToEnum(error : number) : Errors
{
  switch (error) {
    case 400: {
      return Errors.BadRequest;
    }
    case 401: {
      return Errors.Unauthorized;
    }
    case 403: {
      return Errors.Forbidden;
    }
    case 404: {
      return Errors.NotFound;
    }
    case 500: {
      return Errors.ServerError;
    }
    default: {
      return Errors.ServerError;
    }
  }
}
