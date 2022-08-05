#!/usr/bin/env sh

for I in `seq 1 100`; do
    curl http://app-example.app-example.localhost \
        --silent \
        --resolve app-example.app-example.localhost:80:127.0.0.1
done \
    | jq --raw-output .subset \
    | sort --numeric-sort \
    | uniq --count
