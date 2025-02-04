import { User } from '../interfaces/api-response.interface';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
