#!/bin/sh

trap exit 1 2 15

sleep 5 &
wait $! # istio-proxy wait

apk add curl \
    --quiet

while true; do
    curl http://whoami.whoami \
        --silent \
        --resolve whoami.whoami:80:1.1.1.1
    sleep 5 &
    wait $!
done
