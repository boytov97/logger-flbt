import { plainToInstance } from "class-transformer";
import fs from "fs";
import { ConsoleTransportConfig } from "./types/ConsoleTransportConfig";
import { FluentBitTransportConfig } from "./types/FluentBitTransportConfig";

class LoggerConfig {
    transports!: ConsoleTransportConfig[] | FluentBitTransportConfig[];
}

class ClickhouseConfig {
    public host!: string;

    public port!: number;

    public password!: string;
}

export class ConfigDTO {
    public app!: string;

    public env!: string;

    public buildNumber!: number;

    public logger!: LoggerConfig;

    public clickhouse!: ClickhouseConfig;
}

export async function loadConfig(path: string): Promise<ConfigDTO> {
    const config = plainToInstance(ConfigDTO, JSON.parse(fs.readFileSync(path, "utf8")));

    return config;
}
