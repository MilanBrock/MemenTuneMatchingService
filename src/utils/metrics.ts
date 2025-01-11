import client from 'prom-client';

// Create a Registry to hold all metrics
const register = new client.Registry();

// Default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5] // Buckets for response time durations
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);

export { register, httpRequestDurationMicroseconds };
