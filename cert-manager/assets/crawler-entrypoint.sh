#!/usr/bin/env sh

set -e

trap exit 1 2 15

apk add --quiet curl

while true; do
    date
    for DOMAINNAME in nginx nginx.example nginx.example.svc; do
        curl --silent --cacert /etc/ssl/root-ca/ca.crt "https://$DOMAINNAME";
        echo " $DOMAINNAME"
    done
    sleep 5 &
    wait $!
done
