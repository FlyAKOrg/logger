/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */

/*
 * Copyright (C) 2020 Daniel A. Hawton <daniel@hawton.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loggerWin;
let splashWin;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create Splash Screen
  splashWin = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    setMenuBarVisibility: false,
    alwaysOnTop: true
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await splashWin.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/splash.html`);
    // if (!process.env.IS_TEST) splashWin.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    splashWin.loadURL("app://./index.html");
  }

  // Create the browser window.
  loggerWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    frame: false,
    show: false
  });
  loggerWin.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await loggerWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) loggerWin.webContents.openDevTools();
  } else {
    loggerWin.loadURL("app://./index.html");
  }

  loggerWin.on("closed", () => {
    loggerWin = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loggerWin === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  /* if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    */
  try {
    await installExtension(VUEJS_DEVTOOLS);
  } catch (e) {
    console.error("Vue Devtools failed to install:", e.toString());
  }
  // }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("app_version", event => {
  event.sender.send("app_version", { version: app.getVersion() });
});

ipcMain.on("logger-ready", () => {
  loggerWin.show();
  splashWin.destroy();
});

ipcMain.on("close", () => {
  loggerWin.destroy();
  app.quit();
});
