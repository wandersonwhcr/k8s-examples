# microservices

This example creates microservices for a Music application about Artists and
Albums data. It defines 03 microservices: `app-artists` and `app-albums` to
handle Artists and Albums objects using RESTful API that stores data on MongoDB,
and `app-music` to improve querying via GraphQL.

```sh
k3d cluster create \
    --config ../k3d-example.yaml

kubectl apply \
    --kustomize ../mongodb
```

Every microservice must be built locally and pushed to
`k3d-example-registry:5000` Docker Registry pointing to `127.0.0.1`.

```sh
for APPLICATION in app-music app-artists app-albums; do
    docker build "./$APPLICATION/src" \
        --tag "k3d-example-registry:5000/$APPLICATION"
    docker push "k3d-example-registry:5000/$APPLICATION"
done
```

After, these resources must be deployed on Kubernetes. Every application is
isolated using namespaces and can be access via ingresses.

```sh
kubectl apply \
    --kustomize ./app-artists

kubectl apply \
    --kustomize ./app-albums

kubectl apply \
    --kustomize ./app-music
```

Define an artist named `My Artist` with `curl` and an album `My Album` from this
artist using its UUID.

```sh
curl http://artists.app.localhost/v1/artists \
    --resolve artists.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"name": "My Artist"}'
```

```json
{"_id":"37a8375e-0ac9-47bc-b1f4-ac7e81149cdc"}
```

```sh
curl http://albums.app.localhost/v1/albums \
    --resolve albums.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"name": "My Album", "artists": [{"_id": "37a8375e-0ac9-47bc-b1f4-ac7e81149cdc"}]}'
```

```json
{"_id":"b5b14a07-9ced-4505-9183-15bff62e07a9"}
```

After, use GraphQL to retrieve all artists and albums defined.

```sh
curl http://music.app.localhost/graphql \
    --resolve music.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"query": "{ artists { name albums { name } } }"}'
```

```json
{
  "data": {
    "artists": [
      {
        "name": "My Artist",
        "albums": [
          {
            "name": "My Album"
          }
        ]
      }
    ]
  }
}
```

## References

* [Fastify](https://www.fastify.io/)
* [GraphQL.js](https://graphql.org/graphql-js/)
* [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
