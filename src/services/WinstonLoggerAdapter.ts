import { Logger, createLogger, transport } from "winston";
import { LoggerInterface } from "./LoggerInterface";
import { LogLevel } from "../enums/LogLevel";
import { LogContext } from "../types/LogContext";

export class WinstonLoggerAdapter implements LoggerInterface {
    protected readonly logger: Logger;

    protected readonly context!: LogContext;

    public constructor(transports: transport[], _context: LogContext, parentLogger: Logger | null) {
        this.context = _context;

        if (parentLogger) {
            this.logger = parentLogger.child(_context);
            return;
        }

        this.logger = createLogger({
            defaultMeta: this.context,
            transports: transports,
            levels: {
                [LogLevel.DEBUG]: 40,
                [LogLevel.INFO]: 30,
                [LogLevel.WARNING]: 20,
                [LogLevel.ERROR]: 10,
                [LogLevel.CRITICAL]: 0,
            },
        });
    }

    public info(message: string, context?: LogContext | undefined): void {
        this.log(LogLevel.INFO, message, context);
    }

    public debug(message: string, context?: LogContext | undefined): void {
        this.log(LogLevel.DEBUG, message, context);
    }

    public warning(message: string, context?: LogContext | undefined): void {
        this.log(LogLevel.WARNING, message, context);
    }

    public error(message: string, context?: LogContext | undefined): void {
        this.log(LogLevel.ERROR, message, context);
    }

    public critical(message: string, context?: LogContext | undefined): void {
        this.log(LogLevel.CRITICAL, message, context);
    }

    public createChildLogger(context: LogContext): LoggerInterface {
        return new WinstonLoggerAdapter([], { ...this.context, ...context }, this.logger);
    }

    protected log(level: LogLevel, message: string, context?: LogContext): void {
        this.logger.log(level, message, { context });
    }
}
