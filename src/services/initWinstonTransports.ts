import { TransformableInfo } from "logform";
import { format, transport, transports } from "winston";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TCPTransport from "@hinted-public/winston-tcp";

import { ConsoleTransportConfig } from "../types/ConsoleTransportConfig";
import { FluentBitTransportConfig } from "../types/FluentBitTransportConfig";

export const initWinstonTransports = (configs: ConsoleTransportConfig[] | FluentBitTransportConfig[]): transport[] => {
    return configs.map((config): transport => {
        switch (config.type) {
            case "console": {
                return new transports.Console({
                    level: config.level,
                    format: format.json({
                        maximumDepth: 10,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        replacer: (_key: string, value: any): any => {
                            if (value instanceof Error) {
                                return { error: value.toString(), stack: value.stack };
                            }
                            return value;
                        },
                    }),
                });
            }
            case "fluentBit": {
                const formatJson = format.json({
                    maximumDepth: 10,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    replacer: (_key: string, value: any): any => {
                        if (value instanceof Error) {
                            return { error: value.toString(), stack: value.stack };
                        }
                        return value;
                    },
                });

                return new TCPTransport({
                    level: config.level,
                    host: config.host,
                    port: config.port,

                    secure: false,
                    reconnect: true,
                    reconnectAttempts: 100,
                    reconnectInterval: 1000,

                    formatter: (info: TransformableInfo): string => {
                        return (formatJson.transform(info, formatJson.options) as TransformableInfo)[
                            Symbol.for("message")
                        ];
                    },
                });
            }
            default: {
                throw new Error("Unknown transport type");
            }
        }
    });
};
