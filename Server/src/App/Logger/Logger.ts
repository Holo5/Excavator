import { gray } from 'colors';
import { LogLevel } from './LogLevel';

export class Logger {
  private static log(message: string, level: string): void {
    console.log(`${gray(Logger.date)} | ${level} | ${message}`);
  }

  public static debug(message: string): void {
    Logger.log(message, LogLevel.DEBUG);
  }

  public static info(message: string): void {
    Logger.log(message, LogLevel.INFO);
  }

  public static warn(message: string): void {
    Logger.log(message, LogLevel.WARN);
  }

  public static error(message: string): void {
    Logger.log(message, LogLevel.ERROR);
  }

  public static fatal(message: string): void {
    Logger.log(message, LogLevel.FATAL);
  }

  private static get date(): string {
    return new Date().toLocaleDateString('en-GB',
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
  }
}
