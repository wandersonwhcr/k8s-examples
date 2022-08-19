# oidc

```
make

docker-compose up --detach

# https://keycloak:8443
# Access Administration Console
# Authenticate with User `admin` and Password `admin`
# Create Realm `kubernetes`
# Create Client `cluster` with Client Authentication `off`
# Create User `john.doe` with Password `102030`

./jwt-token.sh john.doe 102030
```
