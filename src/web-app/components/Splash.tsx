import React from "react";
import * as storage from "idb-keyval";
import { version } from "../../../package.json";
import { STORAGE_KEY, AppSettings, DONATE_LINK } from "../../shared/constants";

export default (props: any) => {
  const resetSettings = async () => {
    const settings = await storage.get<AppSettings>(STORAGE_KEY);
    settings.saved = false;
    settings.start_minimized = false;
    await storage.set(STORAGE_KEY, settings);
    window.location.reload();
  };

  const onDonateClick = (e: any) => {
    e.preventDefault();
    require("electron").shell.openExternal(DONATE_LINK);
  };

  const getTimeLeft = (): string => {
    const { seconds } = props;
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  };

  return (
    <div>
      <h2>Nightscout will be here in {getTimeLeft()}</h2>
      <hr />
      <p>Need to change your settings? Click the button below:</p>
      <button onClick={resetSettings}>Open settings</button>
      <p>
        <hr />
        If you find Glucose Ticker useful, consider supporting my work with a
        coffee 😊
      </p>
      <a href="#" onClick={onDonateClick} target="_blank">
        <img
          height="36"
          style={{ border: "0px", height: "36px" }}
          src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
          alt="Buy Me a Coffee at ko-fi.com"
        />
      </a>
    </div>
  );
};
