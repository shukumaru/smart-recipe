import { IdToken } from 'google-auth-library';

declare global {
  namespace Express {
    export interface Request {
      user?: IdToken['payload'];
    }
  }
}
