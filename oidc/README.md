# oidc

This example shows how to authenticate on Kubernetes using OpenID Connect (OIDC)
via Keycloak. ALso, `kubectl` is configured with a generated JWT to access
cluster.

## Keycloak

Keycloak must be installed outside Kubernetes and must be accessible using
HTTPS. `make` can be used to generate certificates using OpenSSL. Docker Compose
initializes Keycloak, mounting certificates as a volume. Another volume is used
to store data.

```
make

docker-compose up --detach
```

Include `keycloak` on `/etc/hosts` pointing to `localhost`. After, create these
resources as follow:

1.  Access [https://keycloak:8443](https://keycloak:8443)
2.  Access Administration Console
3.  Authenticate with User `admin` and Password `admin`
4.  Create Realm `kubernetes`
5.  Create Client `cluster` with Client Authentication `off`
6.  Create Client `kubectl` with Client Authentication `off`
7.  Create Client Scope `cluster` with Type `default`
8.  Add Mapper Type `User Property` with Name `username`, Property `username`, Token Claim Name `username`
9.  Add Mapper Type `Group Membership` with Name `groups`, Token Claim Name `groups` and Full Group Path `off`
10. Add Mapper Type `Audience` Name `audience` and Included Client Audience `cluster`
11. Create Group `developers`
12. Create User `john.doe` with Password `102030`
13. Relates User `john.doe` with Group `developers`

## Kubernetes

Cluster must be created with OIDC enabled for authentication. It receives a
volume with the self signed certificates to allow certificate authority
validation.  `username` and `groups` claims must be checked on JWT and they will
be used to identify users on authorization.

```
k3d cluster create --config ../k3d-example.yaml \
    --volume `pwd`/keycloak/certs:/etc/ssl/certs/keycloak@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-issuer-url=https://keycloak:8443/realms/kubernetes@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-ca-file=/etc/ssl/certs/keycloak/tls.crt@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-client-id=cluster@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-username-claim=username@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-username-prefix=-@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-groups-claim=groups@server:* \
    --k3s-arg --kube-apiserver-arg=oidc-groups-prefix=@server:*
```

After cluster initialization, a Cluster Role called `developers` is created and
it is bound with Group `developers` used on JWT. `developers` can only list and
get namespaces and pods.

```
kubectl apply --filename clusterrole.yaml
kubectl apply --filename clusterrolebinding.yaml
```

## Authentication

Username and password credentials are passed to `jwt.sh` script that uses OpenID
Connect on Keycloak to generate JWT used by `kubectl` as credentials. After, a
new context is created using the same cluster from k3d.

```
./jwt.sh john.doe 102030 > jwt.json

kubectl config set-credentials john.doe@k3d-example \
    --auth-provider oidc \
    --auth-provider-arg idp-issuer-url=https://keycloak:8443/realms/kubernetes \
    --auth-provider-arg idp-certificate-authority=./keycloak/certs/tls.crt \
    --auth-provider-arg client-id=kubectl \
    --auth-provider-arg id-token=`jq -r .access_token jwt.json` \
    --auth-provider-arg refresh-token=`jq -r .refresh_token jwt.json`

kubectl config set-context k3d-example-oidc \
    --cluster k3d-example \
    --user john.doe@k3d-example

kubectl config use-context k3d-example-oidc
```

As defined, `john.doe` from `developers` group can only list and get namespaces
and pods. Anything different from this will be forbidden.

```console
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                      READY   STATUS      RESTARTS   AGE
kube-system   helm-install-traefik-crd-9wlqr            0/1     Completed   0          5h18m
kube-system   helm-install-traefik-d6vkz                0/1     Completed   0          5h18m
kube-system   svclb-traefik-jp4rx                       2/2     Running     0          5h18m
kube-system   coredns-d76bd69b-2q22m                    1/1     Running     0          5h18m
kube-system   svclb-traefik-8s59b                       2/2     Running     0          5h18m
kube-system   svclb-traefik-p8wdl                       2/2     Running     0          5h18m
kube-system   traefik-df4ff85d6-5hr7l                   1/1     Running     0          5h18m
kube-system   local-path-provisioner-6c79684f77-kpfkt   1/1     Running     0          5h18m
kube-system   metrics-server-7cd5fcb6b7-kjvzl           1/1     Running     0          5h18m
kube-system   svclb-traefik-8zjt6                       2/2     Running     0          5h18m

$ kubectl get configmaps --all-namespaces
Error from server (Forbidden): configmaps is forbidden: User "john.doe" cannot list resource "configmaps" in API group "" at the cluster scope
```
