# Flowbroker-UI

[![License badge](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Docker badge - flowbroker-ui](https://img.shields.io/docker/pulls/dojot/flowbroker-ui.svg)](https://hub.docker.com/r/dojot/flowbroker-ui/)

The **Flowbroker-UI** is a UI for Dojots' Flowbroker service based in NodeRed. A flow is a sequence of functional blocks (nodes) to process incoming particular events or device messages. With a flow you can dynamically analyze each new message in order to apply validations, infer information, trigger actions or notifications.

## **Table of Contents**

1. [Overview](#overview)
2. [Dependencies](#dependencies)
3. [Roadmap](#roadmap)
4. [Running the service](#running-the-service)
   1. [Configurations](#configurations)
      1. [General Configurations](#general-configurations)
   2. [How to run](#how-to-run)
5. [Documentation](#documentation)
6. [Issues and help](#issues-and-help)

## Overview

This code is based on Node-Red project, following your schema. Node-RED consists of 6 node modules under the `@node-red` scope, which are pulled together by the top-level `node-red` module.

| Module                                            | Description                                                                                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [node-red](node-red.html)                         | the main module that pulls together all of the internal modules and provides the executable version of Node-RED |
| [@node-red/editor-api](@node-red_editor-api.html) | an Express application that serves the Node-RED editor and provides the Admin HTTP API                          |
| [@node-red/runtime](@node-red_runtime.html)       | the core runtime of Node-RED                                                                                    |
| [@node-red/util](@node-red_util.html)             | common utilities for the Node-RED runtime and editor modules                                                    |
| [@node-red/registry](@node-red_registry.html)     | the internal node registry                                                                                      |
| @node-red/nodes                                   | the default set of core nodes. This module only contains the Node-RED nodes - it does not expose any APIs.      |
| @node-red/editor-client                           | the client-side resources of the Node-RED editor application                                                    |

Check out http://nodered.org/docs/getting-started/ for full instructions about Node-RED.
The @node-red/registry, @node-red/runtime, and @Node-red/utils are used as compiled components.

Furthermore, the UI no longer offered the following features (created by a standard version node-RED):

    - context
    - config-nodes
    - groups
    - subflow
    - import-library
    - export-library

## Dependencies

The Flowbroker-UI depends of the following Dojot services:

    - Auth
    - DeviceManager
    - DataBroker
    - Flowbroker
    - Flowbroker-context-manager
    - Kafka

## Roadmap

We propose some improvements to the Flowbroker-UI, aimed at improving the user experience and adding new features. Below are presented some issues to consider:

- Create translation for Portuguese;
- Creation of example for flows;

## Running the service

### Configurations

Before running the **Flowbroker UI** service within your environment, make sure you configure the
environment variables to match your needs.

You can select the configuration file via the `FLOWBROKERUI_USER_CONFIG_FILE` variable. Its default value
is `production.conf`. Check the [config directory](./config) for the user configurations that are
available by default.

For more information about the usage of the configuration files and environment variables, check the
**ConfigManager** module in our [Microservice SDK](https://github.com/dojot/dojot-microservice-sdk-js).
You can also check the [ConfigManager environment variables documentation](https://github.com/dojot/dojot-microservice-sdk-js/blob/master/lib/configManager/README.md#environment-variables) for more details.

In short, all the parameters in the next sections are mapped to environment variables that begin
with `FLOWBROKERUI_`. You can either use environment variables or configuration files to change their values.
You can also create new parameters via environment variables by following the fore mentioned
convention.

#### General Configurations

| Key               | Purpose                                                             | Default Value | Valid Values             | Environment variable           |
| ----------------- | ------------------------------------------------------------------- | ------------- | ------------------------ | ------------------------------ |
| server.host       | Server address                                                      | 0.0.0.0       | string                   | FLOWBROKERUI_SERVER_HOST       |
| server.port       | Sever Port                                                          | 3000          | integer                  | FLOWBROKERUI_SERVER_PORT       |
| log.console.level | Console logger level                                                | info          | info, debug, error, warn | FLOWBROKERUI_LOG_CONSOLE_LEVEL |
| log.file          | Enables logging on file (location: /var/log/flowui-logs-%DATE%.log) | false         | boolean                  | FLOWBROKERUI_LOG_FILE          |
| log.file.level    | Log level to log on files                                           | info          | string                   | FLOWBROKERUI_LOG_FILE_LEVEL    |
| log.verbose       | Whether to enable logger verbosity or not                           | false         | boolean                  | FLOWBROKERUI_LOG_VERBOSE       |

Besides that, you can also check the red-setting.js file in order to customize Node-RED configurations. All the variables are explained in https://nodered.org/docs/user-guide/runtime/configuration#editor-configuration.

#### Frontend Configuration (Editor-UI)

You also should update the Front-end configuration with Dojot's account, applying in file @node-red/editor-client/src/js/dojot-config.js. After the configuration be made, is necessary re-build the image.

| Key      | Purpose                            | Default Value | Valid Values |
| -------- | ---------------------------------- | ------------- | ------------ |
| user     | Internal Management Dojot username | admin         | string       |
| password | Password used to connect to Dojot  |               | string       |

### How to run

Beforehand, you need an already running dojot instance in your machine. Check out the
[dojot documentation](https://dojotdocs.readthedocs.io)
for more information on installation methods.

Generate the Docker image:

```shell
docker build -t <username>/flowbroker-ui:<tag> -f  .
```

Then an image tagged as `<username>/flowbroker-ui:<tag>` will be made available. You can send it to
your DockerHub registry to made it available for non-local dojot installations:

```shell
docker push <username>/flowbroker-ui:<tag>
```

**NOTE THAT** you can use the official image provided by dojot in its [DockerHub page](https://hub.docker.com/r/dojot/flowbroker-ui).

## Documentation

Check the documentation for more information:

- [Latest dojot platform documentation](https://dojotdocs.readthedocs.io/en/latest)
- [Latest Tutorial Using flow builder](https://dojotdocs.readthedocs.io/en/latest/flow.html)

## Issues and help

If you found a problem or need help, leave an issue in the main
[dojot repository](https://github.com/dojot/dojot) and we will help you!
