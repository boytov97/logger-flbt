-- Создание база данных
CREATE DATABASE database_logs ENGINE = Atomic COMMENT 'The temporary database';

-- Первая пробная таблица
CREATE TABLE database_logs.servicesLongTermLogs
(
    `id` UUID DEFAULT generateUUIDv4(),
    `app` LowCardinality(String),
    `level` LowCardinality(String),
    `shop` Nullable(Int64),
    `shop_sharding` Nullable(UInt8),
    `traceId` Nullable(String),
    `message` String,
    `service` String,
    `context` Nullable(String),
    `extra` Nullable(String),
    `timestamp` DateTime
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY timestamp
TTL timestamp + INTERVAL 1 YEAR DELETE
SETTINGS index_granularity = 8192, allow_nullable_key=true;

-- Буфер таблица для пробной таблицы
CREATE TABLE database_logs.servicesLongTermLogsBuffer as database_logs.servicesLongTermLogs
ENGINE = Buffer(database_logs, servicesLongTermLogs, 1, 10, 120, 5000, 1000000, 500000, 1000000);

-- Правильно организованная таблица с PRIMARY KEY
CREATE TABLE database_logs.servicesLongTermLogsWithPrimaryKey
(
    `id` UUID DEFAULT generateUUIDv4(),
    `app` LowCardinality(String),
    `level` LowCardinality(String),
    `shop` Nullable(Int64),
    `shop_sharding` Nullable(UInt8),
    `traceId` Nullable(String),
    `message` String,
    `service` String,
    `context` Nullable(String),
    `extra` Nullable(String),
    `timestamp` DateTime
)
ENGINE = MergeTree
PRIMARY KEY (shop, app, timestamp)
PARTITION BY toYYYYMM(timestamp)
ORDER BY (shop, app, timestamp)
TTL timestamp + INTERVAL 1 YEAR DELETE
SETTINGS index_granularity = 8192, allow_nullable_key=true;

-- Буфер таблица таблицы с PRIMARY KEY
CREATE TABLE database_logs.servicesLongTermLogsWithPrimaryKeyBuffer as database_logs.servicesLongTermLogsWithPrimaryKey
ENGINE = Buffer(database_logs, servicesLongTermLogsWithPrimaryKey, 1, 10, 120, 5000, 1000000, 500000, 1000000);
