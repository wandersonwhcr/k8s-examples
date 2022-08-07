#!/usr/bin/env sh

set -e

apk add curl \
    --quiet

debug() {
    echo "[`date -R`] $*"
}

request() {
    debug "$1"
    curl "$2" --include --silent --connect-timeout 1 \
        || debug "$1" "Failed to Connect"
}

SUBCOMMAND="$1"

case "$SUBCOMMAND" in
    'app-service-a')
        request 'Service A -> Service B' http://app-service-a.app-service-a
        ;;
    'app-service-a:status')
        request 'Service A:Status' http://app-service-a.app-service-a:8080
        ;;
    'app-service-b')
        request 'Service B' http://app-service-b.app-service-b
        ;;
esac
