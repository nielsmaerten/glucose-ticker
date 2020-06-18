import { BrowserWindow } from "electron";
import AppState from "./app-state";
import { OPEN_DEV_TOOLS } from "../../shared/constants";

const WEBAPP_URL = `file://${__dirname}/html/index.html`;

function initSettingsWindow() {
  const mainWindow = createWindow();
  AppState.mainWindow = mainWindow;

  if (OPEN_DEV_TOOLS) {
    mainWindow.webContents.openDevTools({
      mode: "bottom",
    });
  }
}

/**
 * Sets up the main browser window and
 * navigates to the url of the webapp
 */
function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      // Required to receive settings from the webapp
      nodeIntegration: true,
    },
  });

  window.loadURL(WEBAPP_URL);
  return window;
}

export default initSettingsWindow;
