import { cyan, green, red, yellow } from 'colors';

export class LogLevel {
    public static INFO = cyan.bold('> INFO   ');
    public static WARNING = yellow.bold('! WARNING');
    public static SUCCESS = green.bold('✓ SUCCESS');
    public static ERROR = red.bold('✘ ERROR  ');
}
