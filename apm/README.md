# APM

```
# Service Clients Latency
rate(latency_sum{service_name="app-albums", span_kind="SPAN_KIND_CLIENT"}[30s])

# Service Language Latency
sum(rate(latency_sum{service_name="app-albums", span_kind="SPAN_KIND_SERVER"}[30s]))
- sum(rate(latency_sum{service_name="app-albums", span_kind="SPAN_KIND_CLIENT"}[30s]))
```
