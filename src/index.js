// @ts-check
const path = require('path');
const fs = require("fs");
//const ChildProcess = require("child_process")

const log = (msg) => {
  var now = new Date().toISOString();
  const logname = "install.log"
  if (!fs.existsSync(logname)) {
    fs.writeFileSync(logname, now + "\n")
  }
  fs.appendFileSync(logname, "" + now + ": " + msg + "\n")
}

(async function () {
  const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
  const ws = require('windows-shortcuts');

  // this should be placed at top of main.js to handle setup events quickly
  if (await handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
  }

  async function handleSquirrelEvent() {
    if (process.argv.length === 1) {
      return false;
    }

    const exeName = "Glucose Ticker.exe";
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exePath = path.resolve(path.join(rootAtomFolder, exeName));
    const bootstrapperPath = path.resolve(path.join(rootAtomFolder, 'Start Glucose Ticker.bat'));

    /*const spawn = function (command, args) {
      let spawnedProcess, error;

      try {
        spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
      } catch (error) { }

      return spawnedProcess;
    };*/

    /*const spawnUpdate = function (args) {
      return spawn(updateDotExe, args);
    };*/

    const shortcuts = function (create) {
      let shortcutName = "Glucose Ticker.lnk";
      let startMenuPath = "%USERPROFILE%/AppData/Roaming/Microsoft/Windows/Start Menu/Programs"
      let shortcutOptions = {
        desc: "Glanceable glucose on the taskbar",
        target: bootstrapperPath
      }
      let shortcuts = [
        `%USERPROFILE%/Desktop/${shortcutName}`,
        `${startMenuPath}/${shortcutName}`,
        `${startMenuPath}/Startup/${shortcutName}`
      ]

      if (create) {
        log("Creating shortcuts...")
        shortcuts.forEach(s => ws.create(s, shortcutOptions))
      } else {
        log("Deleting shortcuts...")
        shortcuts.forEach(s => fs.unlinkSync(s))
      }

    }

    const squirrelEvent = process.argv[1];
    log("Handling squirrel event: " + squirrelEvent)
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':

        // Write .bat file that starts the app
        fs.writeFileSync(bootstrapperPath, `"Glucose Ticker" /D "${rootAtomFolder}" "${exeName}"`)
        log("Wrote " + bootstrapperPath)

        // Create shortcuts
        shortcuts(true)

        setTimeout(app.quit, 1000);
        return true;

      case '--squirrel-uninstall':
        // Undo anything you did in the --squirrel-install and
        // --squirrel-updated handlers

        // Remove desktop and start menu shortcuts
        shortcuts(false)

        setTimeout(app.quit, 1000);
        return true;

      case '--squirrel-obsolete':
        // This is called on the outgoing version of your app before
        // we update to the new version - it's the opposite of
        // --squirrel-updated

        app.quit();
        return true;
    }
  };

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow;

  const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.minimize();
    var menu = new Menu()
    menu.append(new MenuItem({
      label: "Reset",
      click: () => {
        mainWindow.webContents.session.clearStorageData();
        app.relaunch();
        app.quit();
      }
    }))
    mainWindow.setMenu(menu)

    // Open the DevTools.
    false && mainWindow.webContents.openDevTools({
      mode: "bottom"
    });

    // Create sharedObj on global scope
    // @ts-ignore
    global.sharedObj = {
      lastUpdatedTime: 0,
      mainWindow,
      nsUrl: ""
    }

    // Run cron job now and every 10 seconds
    const cronJob = require("./cron");
    setInterval(cronJob, 10000);
    cronJob();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

  ipcMain.on("set-url", (event, arg) => {
    // @ts-ignore
    global.sharedObj.nsUrl = arg
    event.returnValue = "OK";
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.

})();