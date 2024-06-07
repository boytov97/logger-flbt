import { LogContext } from "../types/LogContext";

export abstract class LoggerInterface {
    public abstract debug(message: string, context?: LogContext): void;

    public abstract info(message: string, context?: LogContext): void;

    public abstract warning(message: string, context?: LogContext): void;

    public abstract error(message: string, context?: LogContext): void;

    public abstract critical(message: string, context?: LogContext): void;

    public abstract createChildLogger(context: LogContext): LoggerInterface;
}
