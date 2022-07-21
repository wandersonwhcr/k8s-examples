# app-factorial-api

Async Factorial API

```
docker-compose up --detach
docker-compose run --rm app-factorial-api run buckets
```

```
./factorial.sh 1
```

## RabbitMQ Topology

* Exchange `app-factorial-api`
* Type: `direct`
* Routing Key: `app-factorial-api.factorials`
