# Overview

This example shows how to use [@opentelemetry/exporter-otlp-http](https://github.com/open-telemetry/opentelemetry-js/tree/v0.26.0/experimental/packages/opentelemetry-exporter-otlp-http) to instrument a simple Node.js application.
This example will export spans data simultaneously using [Exporter Collector](https://github.com/open-telemetry/opentelemetry-js/tree/v0.26.0/experimental/packages/opentelemetry-exporter-otlp-http) and grpc. It will use [proto format](https://github.com/open-telemetry/opentelemetry-proto). The goal is for us to be able to create spans and ultimately see them in the Lightstep UI. 

## Pre-Work

* * *

* You will need `npm` to be installed. To check and see if you have it installed run `npm -v` to see the version.
* You will also need Docker to be installed. If you do not have Docker head over to [their website](https://www.docker.com/products/docker-desktop) and install Docker Desktop. Once installed, you'll need to make sure that it is running since the `docker:start` command depends on being able to connect to the Docker daemon. 

## Installation

* * *

```
# from this directory
npm install
```

## Run the Application

* * *

1. **Run docker.** If you are having trouble make sure that Docker Desktop is running so we can connect to the Docker daemon. 

```
# from this directory
npm run docker:start
```

1. **Run tracing app.** Once you run this part of the code, spans should show up in your console. To send traces to Lightstep, make sure that `accessToken` is set inside the `tracing.js` file.

```
# from this directory
npm run start:tracing
```

You should see traces exported to your console and your instance of Lightstep if you appropriately configured your access token.

## Useful Links

* * *

* For more information on OpenTelemetry, visit: https://opentelemetry.io/
* For more information on JavaScript-specific implementation of OpenTelemetry, visit: https://opentelemetry.io/docs/instrumentation/js/
* For more information on tracing, visit: https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-base

## License

* * *
Apache License 2.0