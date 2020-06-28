import { cyan, gray, red, yellow } from 'colors';

export class LogLevel {
  public static DEBUG = gray.bold.bgBlack('DEBUG');
  public static INFO = cyan.bold.bgBlack(' INFO');
  public static WARN = yellow.bold.bgBlack('WARN');
  public static ERROR = red.bold.bgBlack('ERROR');
  public static FATAL = red.bold.bgWhite('FATAL');
}
