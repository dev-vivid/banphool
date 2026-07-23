const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const env = require('../../config/env');

const { combine, timestamp, errors, json, colorize, printf } = format;

const consoleFormat = combine(
  colorize(),
  printf(({ timestamp: ts, level, message, ...meta }) =>
    `[${ts}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
  )
);

const fileRotateTransport = (filename, level) =>
  new transports.DailyRotateFile({
    filename:    `logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize:     '20m',
    maxFiles:    '14d',
    level,
  });

const logger = createLogger({
  level:  env.logLevel,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
  transports: [
    new transports.Console({ format: combine(timestamp({ format: 'HH:mm:ss' }), consoleFormat) }),
    fileRotateTransport('error',    'error'),
    fileRotateTransport('combined', 'debug'),
  ],
});

module.exports = logger;
