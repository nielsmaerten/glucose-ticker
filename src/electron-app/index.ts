import { app, ipcMain } from "electron";

import initSettingsWindow from "./components/settings-window";
import GlucoseWatcher from "./components/glucose-watcher";
import AppState from "./components/app-state";
import { IPC } from "../shared/constants";

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on(IPC.updateSettings, (event, state) => {
  AppState.setState(state);
});

ipcMain.on(IPC.minimize, () => {
  AppState.mainWindow.minimize();
});

app.on("ready", () => {
  GlucoseWatcher.Instance().start();
  initSettingsWindow();
});

app.on("browser-window-focus", () => {
  GlucoseWatcher.Instance().forceUpdate();
});

// Suppress Electron deprecation notice
app.allowRendererProcessReuse = true;

// I don't know why, but for some reason Rollup refuses to
// bundle the electron app if this line gets removed -_-
// FIXME I guess?
import {} from "../../package.json";
