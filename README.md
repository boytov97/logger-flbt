```
echo '{"id":4,"message": "{\"name\": \"Alex\", \"age\": 57, \"city\": \"New York\"}", "timestamp": "2024-05-19 17:55:11"}' | nc localhost 5170
```

```
docker exec -it clickhouse bash
```

```
CREATE DATABASE db_comment ENGINE = Memory COMMENT 'The temporary database';
```

```
CREATE TABLE db_comment.logs_from_fluentbit (id UInt32, message String, timestamp DateTime) ENGINE = MergeTree PRIMARY KEY (id, timestamp);
```

```
INSERT INTO db_comment.logs_from_fluentbit (id, message, timestamp) VALUES (1, '{"name": "Andrew", "age": 56, "city": "New York"}', now());
```

```
SELECT id, JSON_VALUE(message, '$.name') as name FROM db_comment.logs_from_fluentbit LIMIT 10;
```
