#!/usr/bin/env sh

apk add coreutils openssl \
    --quiet

trap exit 1 2 15

while true; do
    echo `date --rfc-3339 seconds` `openssl rand -hex 20`
    sleep 1 &
    wait $!
done
