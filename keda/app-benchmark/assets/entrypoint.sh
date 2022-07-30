#!/usr/bin/env sh
set -xe
trap exit 1 2 15
apk add apache2-utils -q
ab -n 500000 -c 1000 http://app-example.app-example/ &
wait $!
