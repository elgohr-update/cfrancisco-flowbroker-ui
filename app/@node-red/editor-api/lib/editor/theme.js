/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * */

const { Logger } = require("@dojot/microservice-sdk");

const express = require("express");

const util = require("util");

const path = require("path");

const fs = require("fs");

const clone = require("clone");

const logger = new Logger("editor-api:theme");

const defaultContext = {
  page: {
    title: "Node-RED",
    favicon: "favicon.ico",
    tabicon: "red/images/node-red-icon-black.svg"
  },
  header: {
    title: "Node-RED",
    image: "red/images/node-red.svg"
  },
  asset: {
    red: "red/red.js",
    main: "red/main.js",
    vendorMonaco: ""
  }
};

let theme = null;
let themeContext = clone(defaultContext);
let themeSettings = null;

let activeTheme = null;
let activeThemeInitialised = false;

let runtimeAPI;
let themeApp;

function serveFile(app, baseUrl, file) {
  try {
    const stats = fs.statSync(file);
    const url = baseUrl + path.basename(file);
    logger.info(url, "->", file);
    app.get(url, (req, res) => {
      res.sendFile(file);
    });
    return `theme${url}`;
  } catch (err) {
    // TODO: log filenotfound
    return null;
  }
}

function serveFilesFromTheme(themeValue, themeApp, directory, baseDirectory) {
  const result = [];
  if (themeValue) {
    let array = themeValue;
    if (!util.isArray(array)) {
      array = [array];
    }

    for (let i = 0; i < array.length; i++) {
      let fullPath = array[i];
      if (baseDirectory) {
        fullPath = path.resolve(baseDirectory, array[i]);
        if (fullPath.indexOf(baseDirectory) !== 0) {
          continue;
        }
      }
      const url = serveFile(themeApp, directory, fullPath);
      if (url) {
        result.push(url);
      }
    }
  }
  return result;
}

module.exports = {
  init(settings, _runtimeAPI) {
    runtimeAPI = _runtimeAPI;
    themeContext = clone(defaultContext);
    themeSettings = null;
    theme = settings.editorTheme || {};
    themeContext.asset.vendorMonaco = ((theme.codeEditor || {}).lib === "monaco") ? "vendor/monaco/monaco-bootstrap.js" : "";
    activeTheme = theme.theme;
  },

  app() {
    let i;
    let url;
    themeSettings = {};

    themeApp = express();

    if (theme.page) {
      themeContext.page.css = serveFilesFromTheme(
        theme.page.css,
        themeApp,
        "/css/"
      );
      themeContext.page.scripts = serveFilesFromTheme(
        theme.page.scripts,
        themeApp,
        "/scripts/"
      );

      if (theme.page.favicon) {
        url = serveFile(themeApp, "/favicon/", theme.page.favicon);
        if (url) {
          themeContext.page.favicon = url;
        }
      }

      if (theme.page.tabicon) {
        url = serveFile(themeApp, "/tabicon/", theme.page.tabicon);
        if (url) {
          themeContext.page.tabicon = url;
        }
      }

      themeContext.page.title = theme.page.title || themeContext.page.title;

      // Store the resolved urls to these resources so nodes (such as Debug)
      // can access them
      theme.page._ = {
        css: themeContext.page.css,
        scripts: themeContext.page.scripts,
        favicon: themeContext.page.favicon
      };
    }

    if (theme.header) {
      themeContext.header.title = theme.header.title || themeContext.header.title;

      if (theme.header.hasOwnProperty("url")) {
        themeContext.header.url = theme.header.url;
      }

      if (theme.header.hasOwnProperty("image")) {
        if (theme.header.image) {
          url = serveFile(themeApp, "/header/", theme.header.image);
          if (url) {
            themeContext.header.image = url;
          }
        } else {
          themeContext.header.image = null;
        }
      }
    }

    if (theme.deployButton) {
      if (theme.deployButton.type == "simple") {
        themeSettings.deployButton = {
          type: "simple"
        };
        if (theme.deployButton.label) {
          themeSettings.deployButton.label = theme.deployButton.label;
        }
        if (theme.deployButton.icon) {
          url = serveFile(themeApp, "/deploy/", theme.deployButton.icon);
          if (url) {
            themeSettings.deployButton.icon = url;
          }
        }
      }
    }

    if (theme.hasOwnProperty("userMenu")) {
      themeSettings.userMenu = theme.userMenu;
    }

    if (theme.login) {
      if (theme.login.image) {
        url = serveFile(themeApp, "/login/", theme.login.image);
        if (url) {
          themeContext.login = {
            image: url
          };
        }
      }
    }
    themeApp.get("/", async (req, res) => {
      const themePluginList = await runtimeAPI.plugins.getPluginsByType({ type: "node-red-theme" });
      themeContext.themes = themePluginList.map((theme) => theme.id);
      res.json(themeContext);
    });

    if (theme.hasOwnProperty("menu")) {
      themeSettings.menu = theme.menu;
    }

    if (theme.hasOwnProperty("palette")) {
      themeSettings.palette = theme.palette;
    }

    if (theme.hasOwnProperty("projects")) {
      themeSettings.projects = theme.projects;
    }

    if (theme.hasOwnProperty("keymap")) {
      themeSettings.keymap = theme.keymap;
    }

    if (theme.theme) {
      themeSettings.theme = theme.theme;
    }
    return themeApp;
  },
  async context() {
    if (activeTheme && !activeThemeInitialised) {
      const themePlugin = await runtimeAPI.plugins.getPlugin({
        id: activeTheme
      });
      if (themePlugin) {
        if (themePlugin.css) {
          const cssFiles = serveFilesFromTheme(
            themePlugin.css,
            themeApp,
            "/css/",
            themePlugin.path
          );
          themeContext.page.css = cssFiles.concat(themeContext.page.css || []);
          theme.page = theme.page || { _: {} };
          theme.page._.css = cssFiles.concat(theme.page._.css || []);
        }
        if (themePlugin.scripts) {
          const scriptFiles = serveFilesFromTheme(
            themePlugin.scripts,
            themeApp,
            "/scripts/",
            themePlugin.path
          );
          themeContext.page.scripts = scriptFiles.concat(themeContext.page.scripts || []);
          theme.page = theme.page || { _: {} };
          theme.page._.scripts = scriptFiles.concat(theme.page._.scripts || []);
        }
      }
      activeThemeInitialised = true;
    }
    return themeContext;
  },
  settings() {
    return themeSettings;
  },
  serveFile(baseUrl, file) {
    return serveFile(themeApp, baseUrl, file);
  }
};
