import { ClickHouseClient } from "@clickhouse/client";

export type RewardsLog = Record<string, any>;

export class RewardsLogsRepository {
    public constructor(protected readonly clickHouseClient: ClickHouseClient) {}

    public async createMany(logs: RewardsLog[]): Promise<void> {
        await this.clickHouseClient.insert({
            table: "db_comment.servicesLongTermLogsWithPrimaryKeyBuffer",
            values: logs,
            format: "JSONEachRow",
        });
    }
}
