import "reflect-metadata";

import { randomUUID } from "crypto";
import { format } from "date-fns";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { loadConfig } from "./config";
import { WinstonLoggerAdapter } from "./services/WinstonLoggerAdapter";
import { initWinstonTransports } from "./services/initWinstonTransports";
import { getRandomDate, getRandomInt } from "./utils/randomGenerator";
import { createClient } from "@clickhouse/client";
import { RewardsLogsRepository } from "./repositories/RewardsLogsRepository";
import { LogLevel } from "./enums/LogLevel";

const main = async () => {
    const args = yargs(hideBin(process.argv))
        .option("config", { string: true, demandOption: true, description: "Path to JSON config file" })
        .parseSync();

    const config = await loadConfig(args.config);
    const logger = new WinstonLoggerAdapter(
        initWinstonTransports(config.logger.transports),
        {
            env: config.env,
            buildNumber: config.buildNumber,
        },
        null,
    );

    const client = createClient({
        host: `http://${config.clickhouse.host}:${config.clickhouse.port}`, // defaults to 'http://localhost:8123'
        //password: process.env["CLICKHOUSE_PASSWORD"], // defaults to an empty string
        max_open_connections: 10,
        clickhouse_settings: {
            // https://clickhouse.com/docs/en/operations/settings/settings#async-insert
            async_insert: 1,
            // https://clickhouse.com/docs/en/operations/settings/settings#wait-for-async-insert
            // explicitly disable it on the client side;
            // insert operations promises will be resolved as soon as the request itself was processed on the server.
            wait_for_async_insert: 0,
            // https://clickhouse.com/docs/en/operations/settings/settings#async-insert-max-data-size
            async_insert_max_data_size: "1000000",
            // https://clickhouse.com/docs/en/operations/settings/settings#async-insert-busy-timeout-ms
            async_insert_busy_timeout_ms: 1000,
        },
    });

    const rewardsLogsRepository = new RewardsLogsRepository(client);

    let handledMessageCount = 0;

    const handleMessage = () => {
        handledMessageCount++;

        const createdAt = getRandomDate(new Date("2024-01-01T01:57:45.271Z"), new Date("2024-01-31T23:59:45.271Z"));
        const shopId = getRandomInt(10000);
        const appSuffix = getRandomInt(20);

        const certainLogger = logger.createChildLogger({
            app: `rewards-execution-worker-${appSuffix}`,
            service: `BaseMessageHandlerT${appSuffix}`,
            traceId: randomUUID(),
            shop: shopId,
            shop_sharding: shopId % 100,
            extra: {
                messageType: "v1/customer/balance_changed",
                messageSource: "rewards-execution-worker",
                customerId: getRandomInt(11000),
            },
            timestamp: format(createdAt, "yyyy-MM-dd HH:mm:ss"), //"2024-01-01 09:56:26",
        });

        certainLogger.info("Testing message", {
            messageId: getRandomInt(1100030000),
            handledMessageCount,
        });
    };

    // const logInterval = setInterval(() => {
    //     handleMessage();
    // }, 200);

    let executedHandleCount = 0;
    let handleLoopEndedCount = 0;

    const handleMessage2 = async () => {
        executedHandleCount++;

        const rows = [];
        for (let i = 0; i < 20000; i++) {
            const createdAt = getRandomDate(new Date("2024-04-01T01:57:45.271Z"), new Date("2024-04-30T23:59:45.271Z"));
            const shopId = getRandomInt(10000);
            const appSuffix = getRandomInt(20);

            rows.push({
                env: config.env,
                level: LogLevel.INFO,
                app: `rewards-execution-worker-${appSuffix}`,
                service: `BaseMessageHandlerT${appSuffix}`,
                traceId: randomUUID(),
                shop: shopId,
                shop_sharding: shopId % 100,
                message: {
                    messageId: getRandomInt(1100030000),
                    customerId: getRandomInt(1102340000),
                },
                extra: {
                    messageType: "v1/customer/balance_changed",
                    messageSource: "rewards-execution-worker",
                    customerId: getRandomInt(11000),
                },
                timestamp: format(createdAt, "yyyy-MM-dd HH:mm:ss"), //"2024-01-01 09:56:26",
            });

            if (i === 9999) {
                handleLoopEndedCount++;
            }
        }

        await rewardsLogsRepository.createMany(rows);

        logger.info("Handling ended", { rows: rows.length, handleLoopEndedCount });
    };

    const logInterval = setInterval(async () => {
        if (executedHandleCount === handleLoopEndedCount) {
            await handleMessage2();
        }
    }, 300);

    const shutdown = () => {
        clearInterval(logInterval);
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
};

void main().catch((error) => console.log({ error: error }));
