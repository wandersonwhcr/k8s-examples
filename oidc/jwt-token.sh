#!/usr/bin/env sh

KEYCLOAK_USER="$1"
KEYCLOAK_USER_PASSWORD="$2"

curl https://keycloak:8443/realms/kubernetes/protocol/openid-connect/token \
    --silent --show-error --fail \
    --cacert ./keycloak/certs/tls.crt \
    --request POST \
    --data grant_type=password \
    --data client_id=cluster \
    --data username="$KEYCLOAK_USER" \
    --data password="$KEYCLOAK_USER_PASSWORD" \
    | jq --raw-output .access_token
