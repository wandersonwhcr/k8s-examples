# oidc

```
make

docker-compose up --detach

# https://keycloak:8443
# Access Administration Console
# Authenticate with User `admin` and Password `admin`
# Create Realm `kubernetes`
# Create Client `cluster` with Client Authentication `off`
# Create Client Scope `cluster` with Type `default`
# Add Mapper Type `User Property` with Name `username`, Property `username`, Token Claim Name `username`
# Add Mapper Type `Group Membership` with Name `groups`, Token Claim Name `groups` and Full Group Path `off`
# Add Mapper Type `Audience` Name `audience` and Included Client Audience `cluster`
# Relates Client `cluster` with Client Scope `cluster` with Assigned Type `default`
# Create Group `developers`
# Create User `john.doe` with Password `102030`
# Relates User `john.doe` with Group `developers`

k3d cluster create --config ../k3d-example.yaml \
    --volume `pwd`/keycloak/certs:/etc/ssl/certs/keycloak@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-issuer-url=https://keycloak:8443/realms/kubernetes@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-ca-file=/etc/ssl/certs/keycloak/tls.crt@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-client-id=cluster@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-username-claim=username@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-username-prefix=-@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-groups-claim=groups@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-groups-prefix=@server:*

kubectl apply --filename clusterrole.yaml
kubectl apply --filename clusterrolebinding.yaml

kubectl config view --minify --output json \
    | jq .clusters[].cluster.server > kubernetes-api

./jwt-token.sh john.doe 102030 > token

KUBERNETES_API=`cat kubernetes-api`
KUBERNETES_TOKEN=`cat token`

curl "$KUBERNETES_API/api/v1/namespaces" \
    --insecure \
    --silent --show-error --fail \
    --oauth2-bearer "$TOKEN"
```
