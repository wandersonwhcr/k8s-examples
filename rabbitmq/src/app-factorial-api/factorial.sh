#!/usr/bin/env sh

set -xe

REQUEST_DATA=`echo "$1" | jq 'tonumber | { number: . }'`

TEMPORARY_FILENAME=`mktemp`

curl http://app-factorial-api.example.localhost/factorials \
    --silent \
    --resolve app-factorial-api.example.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data "$REQUEST_DATA" > "$TEMPORARY_FILENAME"

FACTORIAL_ID=`jq --raw-output .id "$TEMPORARY_FILENAME"`

rm "$TEMPORARY_FILENAME"

sleep 1

curl http://app-factorial-api.example.localhost/factorials/"$FACTORIAL_ID" \
    --resolve app-factorial-api.example.localhost:80:127.0.0.1 \
    --include
