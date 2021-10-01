//#region Dependency Imports

// React stuff
import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";

// Electron stuff
import { App } from "electron";
const ipcRenderer = window.require("electron").ipcRenderer;

// Components
import Splash from "./components/Splash";
import SettingsForm from "./components/SettingsForm";
import Countdown, { CountdownRenderProps } from "react-countdown";

// Constants, Types, etc.
import * as storage from "idb-keyval";
import * as constants from "../shared/constants";
import { AppSettings } from "../shared/constants";
const { defaultSettings, STORAGE_KEY, IPC } = constants;

//#endregion

const App = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [initialized, setInitialized] = useState(false);
  const _15seconds = 15 * 1000;

  const changeSetting = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    // TODO: save immediately? but only send to electron if the url is valid :)
  };

  const saveSettings = async () => {
    // Store settings in IndexedDB and send to Electron
    const newSettings = { ...settings, saved: true };
    await storage.set(STORAGE_KEY, newSettings);
    ipcRenderer.send(IPC.updateSettings, settings);
    setSettings(newSettings); // New obj ref, so triggers new render
  };

  const renderSettingsForm = () => (
    <SettingsForm
      state={settings}
      onSubmit={saveSettings}
      onStateChange={changeSetting}
    ></SettingsForm>
  );

  // Renders the Splash component at first,
  // then redirects to Nightscout after countdown hits 0.
  const renderCountdown = () => (
    <Countdown
      date={Date.now() + _15seconds}
      renderer={(props: CountdownRenderProps) => {
        if (!props.completed) {
          return (
            <Splash
              s={props.seconds}
              ms={props.milliseconds}
              total={props.total}
            ></Splash>
          );
        } else {
          window.location.href = settings.nsUrl;
          return <p>Getting Nightscout ...</p>;
        }
      }}
    ></Countdown>
  );

  // This effect runs once after mounting <App/>
  useEffect(() => {
    (async () => {
      // Fetch settings from IndexedDB
      const settings = await storage.get<AppSettings>(STORAGE_KEY);
      setInitialized(true);

      // If settings exist, configure Electron process
      if (settings) {
        setSettings(settings);
        ipcRenderer.send(IPC.updateSettings, settings);
        if (settings.start_minimized) ipcRenderer.send(IPC.minimize);
      }
    })();
  }, []);

  // Print init message while we wait for Settings
  // to be loaded by useEffect()
  if (!initialized) {
    return <p>Initializing ...</p>;
  }

  // Settings have not been saved before (defaults)
  if (!settings.saved) {
    return renderSettingsForm();
  }

  // Settings have been saved before:
  // Give time to reset, or redirect to Nightscout
  return renderCountdown();
};

export default App;
