import type { RequestHandler } from 'express';
import morgan from 'morgan';
import env from '../utils/envConfig';

const requestLogger: RequestHandler = (req, res, next) => {
  if (env.NODE_ENV !== 'test') {
    morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined')(req, res, next);
  } else {
    next();
  }
};

export default requestLogger;
