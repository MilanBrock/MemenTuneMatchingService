import { Request, Response, NextFunction } from 'express';
import { httpRequestDurationMicroseconds } from '../utils/metrics'; // Import your custom metrics

const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startEpoch = Date.now();

  res.on('finish', () => {
    const responseTimeInSeconds = (Date.now() - startEpoch) / 1000;

    // Record metrics with labels: HTTP method, route, and status code
    httpRequestDurationMicroseconds.labels(req.method, req.route?.path || req.url, res.statusCode.toString()).observe(responseTimeInSeconds);
  });

  next();
};

export default metricsMiddleware;
