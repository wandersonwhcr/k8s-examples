# app-factorial-worker

Worker for Factorial API

```
docker-compose up --detach
```

## RabbitMQ Topology

* Queue `app-factorial-worker`
* Binding
  * Exchange `app-factorial-api`
  * Queue `app-factorial-worker`
  * Routing Key `app-factorial-api.factorials`
