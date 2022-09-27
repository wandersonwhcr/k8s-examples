# app-artists

Artists Application

## Development

```
docker-compose run --rm app-artists npm install
docker-compose up
```

## Build

```
docker build ./src \
    --tag app-artists:`git rev-parse --short HEAD`
```
