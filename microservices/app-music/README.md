# app-music

Music Application

## Development

```
docker-compose run --rm app-music npm install
docker-compose up
```

## Build

```
docker build ./src \
    --tag app-music:`git rev-parse --short HEAD`
```
