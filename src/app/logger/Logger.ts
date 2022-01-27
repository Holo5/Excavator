import { LogLevel } from './LogLevel';
import { gray } from 'colors';

export class Logger {
    private static log(level: string, message: string): void {
        console.log(`${gray(Logger.date)} | ${level} | ${message}`);
    }

    public static success(message: string): void {
        Logger.log(LogLevel.SUCCESS, message);
    }

    public static info(message: string): void {
        Logger.log(LogLevel.INFO, '    » ' + message);
    }

    public static warning(message: string): void {
        Logger.log(LogLevel.WARNING, message);
    }

    public static error(message: string): void {
        Logger.log(LogLevel.ERROR, message);
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
