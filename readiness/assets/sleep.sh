#!/usr/bin/env sh

set -xe

trap exit 1 2 15

date
sleep "$SLEEP_STARTUP" &
wait $!
date
touch /tmp/healthy
sleep infinity &
wait $!
