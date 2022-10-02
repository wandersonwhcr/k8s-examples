#!/usr/bin/env sh

trap cleanup 0 1 2 15

cleanup() {
    rm --force "$APP_ARTIST_ID_JSON"
}

APP_ARTIST_ID_JSON=`mktemp`

curl http://artists.app.localhost/v1/artists \
    --silent \
    --resolve artists.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"name": "My Artist"}' > "$APP_ARTIST_ID_JSON"

APP_ALBUM_JSON=`
    cat "$APP_ARTIST_ID_JSON" \
        | jq '{ "name": "My Album", "artists": [ . ] }' \
            --compact-output
`

curl http://albums.app.localhost/v1/albums \
    --silent \
    --resolve albums.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data "$APP_ALBUM_JSON" > /dev/null

curl http://music.app.localhost/graphql \
    --silent \
    --resolve music.app.localhost:80:127.0.0.1 \
    --request POST \
    --header 'Content-Type: application/json' \
    --data '{"query": "{ artists { name albums { name } } }"}' \
    | jq
