## Логи в clickhouse через fluentbit

...

Ниже указанная команда отправляет один message в fluentbit. Оно было использовано при проверке фильтров и clickhouse output fluentbit'а.

```
echo '{"app":"rewards-worker","level":"INFO","env":"production","shop":4460,"shop_sharding":60,"traceId":"4FGDT-DHFYD-DHFR","message": "{\"name\": \"Alex\", \"age\": 57, \"city\": \"New York\"}","service":"BaseMessageHandler","extra":"{\"customerId\":563}","timestamp": "2024-05-19 17:55:11"}' | nc localhost 5170
```
