#!/usr/bin/env sh

set -xe

date
sleep "$SLEEP_STARTUP"
date
touch /tmp/healthy
sleep infinity
