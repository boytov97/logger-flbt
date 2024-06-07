import { LogLevel } from "../enums/LogLevel";

export type FluentBitTransportConfig = {
    type: "fluentBit";
    level: LogLevel;
    host: string;
    port: number;
};
