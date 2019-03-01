import {createLogger, format, transports} from 'winston';
import {LogStashFormat} from './winston/format/LogStashFormat';
import {LogTraceFormat} from './winston/format/LogTraceFormat';
import {SimpleFormat} from './winston/format/SimpleFormat';
import {HttpTransform} from './winston/transport/HttpTransform';

const { combine, timestamp } = format;

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    LogTraceFormat(),
    process.env.NODE_ENV !== 'production' ? SimpleFormat() : LogStashFormat()
  ),
  transports: [
    process.env.NODE_ENV !== 'production' ? new transports.Console({
      format: format.json()
    }) : new transports.Http(HttpTransform.getReportHttpOption())
  ]
});
