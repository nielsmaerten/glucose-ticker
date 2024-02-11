import React from "react";
import * as storage from "idb-keyval";
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

  return (
    <div>
      <button onClick={resetSettings}>Click here to change settings</button>
      <h2>
        Showing your Nightscout in {props.s}{" "}
        {props.s === 1 ? "second" : "seconds"}
      </h2>
      <h4>
      Found this app helpful?
      Consider.
      {" "}
      <a href="" onClick={onDonateClick}>supporting my caffeine addiction</a>
      {" "}
      to fuel more creations like this.
      {" ☕"}
      </h4>
    </div>
  );
};
