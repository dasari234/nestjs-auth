import { User } from '../interfaces/api-response.interface'; // Import the User type from wherever it's defined

declare global {
  namespace Express {
    interface Request {
      user?: User; // Define 'user' property on the request
    }
  }
}
