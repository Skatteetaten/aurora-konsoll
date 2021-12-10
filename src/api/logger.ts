import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { env } = process;

const LOG_FILE_PATH = env.LOG_FILE_PATH || '/u01/logs/';
const LOG_INDEX_STRATEGY = env.LOG_INDEX_STRATEGY;
const LOG_LEVEL = env.LOG_LEVEL || 'info';

const customLevels = {
  error: 0,
  warning: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ timestamp, level, message, ...rest }) => {
  return JSON.stringify({
    timestamp,
    level: level.toUpperCase(),
    message: !!message ? message : '',
    ...rest,
  });
});

export const logger = winston.createLogger({
  levels: customLevels,
  format: combine(timestamp(), customFormat),
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL,
    }),
  ],
});

if (LOG_INDEX_STRATEGY === 'file' || LOG_INDEX_STRATEGY === 'both') {
  logger.add(
    new DailyRotateFile({
      filename: `${LOG_FILE_PATH}application-%DATE%.log`,
      auditFile: `${LOG_FILE_PATH}application.audit.json`,
      datePattern: 'YYYY-MM-DD',
      level: LOG_LEVEL,
      maxSize: '50m',
      maxFiles: 3,
    })
  );
}
