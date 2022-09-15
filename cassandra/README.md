# cassandra

This example shows how to install Apache Cassandra Single Node using a
`StatefulSet` resource.

```
k3d cluster create \
    --config ../k3d-example.yaml \
    && sleep 2 \
    && k3d node create example-agent-cassandra \
        --cluster example \
        --replicas 1 \
        --memory 4G \
        --role agent \
        --k3s-arg --node-taint=node.kubernetes.io/owner=cassandra:NoSchedule

kubectl apply \
    --kustomize ./
```

A single Cassandra node `cassandra-0` will be initialized after readiness probe
success.

```
$ kubectl get pods --watch --namespace cassandra
NAME          READY   STATUS              RESTARTS   AGE
cassandra-0   0/1     Pending             0          0s
cassandra-0   0/1     Pending             0          0s
cassandra-0   0/1     ContainerCreating   0          0s
cassandra-0   0/1     Running             0          1s
cassandra-0   1/1     Running             0          94s
```

Service will be available in a headless service and can be checked using `cqsh`.

```console
$ kubectl exec -it cassandra-0 -- cqlsh cassandra.cassandra.svc --execute 'show version'
[cqlsh 6.0.0 | Cassandra 4.0.6 | CQL spec 3.4.5 | Native protocol v5]
```

## References

* [Deploying Cassandra with a StatefulSet](https://kubernetes.io/docs/tutorials/stateful-application/cassandra/)
* [Cassandra 4 on Docker Compose](https://citizix.com/how-to-run-cassandra-4-with-docker-and-docker-compose/)
