# lights-service [![Build Status](https://travis-ci.org/wolfika/lights-service.svg?branch=master)](https://travis-ci.org/wolfika/lights-service) [![codecov](https://codecov.io/gh/wolfika/lights-service/badge.svg?branch=master)](https://codecov.io/gh/wolfika/lights-service?branch=master)

> Node.js microservice used to serve as a clean RESTful interface to Milight lights

## Installation

1. Git clone this repository.
2. `$ yarn install`
3. Copy `keys.json.example` to `keys.json` and populate with your own desired client keys.
4. `$ yarn start` (or `yarn dev` for development use)

## Configuration

### Authentication

The service authenticates clients using a client key sent via the `X-Client-Key` HTTP header. Every request must contain this header. If this header is missing, or its value is empty, the service returns 401.

When a request arrives, the service checks whether the provided client key is included in the permitted array of client keys (based on `keys.json`). If it is not, the service returns 403.

### Port

You can change the port the service listens on, by specifing it in the `PORT` environment variable when starting the service. For example:

```
$ PORT=8000 yarn start
```

The default port is 3000.

## Usage

After starting the service, you can send HTTP POST requests to the root URL. The request body must contain at least one valid commmand. See Commands section below, to get more details on how commands work.

### Commands

This section lists possible commands for the service.

### Power on/off

Turn the lights on:

```
{
    "power": "on"
}
```

Turn the lights off:

```
{
    "power": "off"
}
```

### Change color

```
{
    "color": "#fff"
}
```

```
{
    "color": "#f0f0f0"
}
```

```
{
    "color": "red"
}
```

### Dim

Dim the lights to 50% brightness.

```
{
    "dim": 50
}
```

### Responses

If everything went well, the service will return status 200, and this body:

```
{
    "error": false
}
```

If there was an error, the service will return the corresponding status code (4xx for client error, 500 for server error), and a body describing the actual error with a message:

```
{
   "error": "Invalid client key sent"
}
```

## License

MIT © [Máté Farkas](https://github.com/wolfika)
