# app-albums

Albums Application

## Development

```
docker-compose run --rm app-albums npm install
docker-compose up
```

## Build

```
docker build ./src \
    --tag app-albums:`git rev-parse --short HEAD`
```
