#!/usr/bin/env sh

set -xe

apk add --quiet \
    curl \
    jq \
    tea

GITEA_TOKEN_FILENAME=`mktemp`

curl "${GITEA_SERVER_URL}/api/v1/users/${GITEA_SERVER_USER}/tokens" \
    --silent --fail \
    --request POST \
    --header 'Content-Type: application/json' \
    --user "${GITEA_SERVER_USER}:${GITEA_SERVER_PASSWORD}" \
    --data '{ "name": "tea", "scopes": [ "all" ] }' \
    > "${GITEA_TOKEN_FILENAME}"

export GITEA_SERVER_TOKEN=`jq .sha1 --raw-output "${GITEA_TOKEN_FILENAME}"`

tea login add \
    --name gitea \
    --url "${GITEA_SERVER_URL}" \
    --token "${GITEA_SERVER_TOKEN}"

tea login default gitea

tea organizations create my-org

tea repos create \
    --owner my-org \
    --name my-app
