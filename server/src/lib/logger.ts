import { pino, type LoggerOptions } from 'pino';

import { env } from '../config/env';

const usePrettyLogs = env.NODE_ENV === 'development';

const options: LoggerOptions = {
  level: env.LOG_LEVEL,
  base: { service: 'prolinker-api' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
      '*.access_token',
      '*.refresh_token',
      '*.cnic_number',
    ],
    censor: '[REDACTED]',
  },
};

if (usePrettyLogs) {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname,service' },
  };
}

export const logger = pino(options);
