#!/usr/bin/env sh

set -xe

trap exit 1 2 15

date
env | grep ^APP_
sleep infinity &
wait $!
