#!/usr/bin/env sh

apk add jq openssl \
    --quiet

trap exit 1 2 15

while true; do
    echo `openssl rand -hex 20` \
        | jq --raw-input '{ "hash" : . }' --compact-output
    sleep 1 &
    wait $!
done
