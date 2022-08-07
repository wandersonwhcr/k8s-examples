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
    'app-service')
        request 'Service' http://app-service.app-service
        ;;
    'app-proxy')
        request 'Proxy -> Service' http://app-proxy.app-proxy
        ;;
    'app-proxy:status')
        request 'Proxy:Status' http://app-proxy.app-proxy:8080
        ;;
esac
