#!/usr/bin/env sh

apk add openssl \
    --quiet

trap exit 1 2 15

while true; do
    echo `date +"%Y-%m-%dT%H:%M:%S%z"` `openssl rand -hex 20`
    sleep 1 &
    wait $!
done
