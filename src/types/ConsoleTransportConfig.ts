import { LogLevel } from "../enums/LogLevel";

export type ConsoleTransportConfig = {
    type: "console";
    level: LogLevel;
};
