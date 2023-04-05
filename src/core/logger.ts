import winston from "winston";

interface ILogger {
  info(message: any): void;
  debug(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}
/**
 * Logger Class
 * 
 * To be used as a logger
 */
export default class Logger implements ILogger {
  private _logger: winston.Logger;
  private _defaultFormat = winston.format.printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp}\t{${label}}\t[${level.toUpperCase()}]\t> ${message}`
  );
  constructor(name: string) {
    this._logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        winston.format.label({ label: name }),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `{${info.timestamp}} [${info.level}] ${info.label} ${info.message}`
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }

  info(message: any): void {
    this._logger.info(message);
  }
  debug(message: any): void {
    this._logger.debug(message);
  }
  warn(message: any): void {
    this._logger.warn(message);
  }
  error(message: any): void {
    this._logger.error(message);
  }
}
