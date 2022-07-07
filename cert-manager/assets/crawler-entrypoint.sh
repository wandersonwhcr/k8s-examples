#!/usr/bin/env sh

set -e

trap exit 1 2 15

apk add --quiet curl

while true; do
    date
    for DOMAINNAME in nginx nginx.example nginx.example.svc.cluster.local; do
        curl --silent --cacert /etc/ssl/crawler/ca.crt "https://$DOMAINNAME"; echo
    done
    sleep 5
    wait $!
done
