import React, { useEffect } from "react";
import * as storage from "idb-keyval";
import { version, repository } from "../../../package.json";
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

  const onVersionClick = (e: any) => {
    e.preventDefault();
    require("electron").shell.openExternal(repository.url + "/releases");
  };

  const getTimeLeft = (props: any): string => {
    const { s } = props;
    return `${s} ${s === 1 ? "second" : "seconds"}`;
  };

  const getLatestVersion = async () => {
    const response = await fetch(
      "https://api.github.com/repos/nielsmaerten/glucose-ticker/releases/latest",
    );
    const data = await response.json();
    return data.tag_name || "N/A";
  };

  const showVersionTag = () => {
    const aLatestVersion = (
      <a href="#" onClick={onVersionClick}>
        {latestVersion}
      </a>
    );
    const vVersion = "v" + version; // v1.0.0
    return (
      <p>
        <small>
          {vVersion}
          {latestVersion !== vVersion && (
            <strong> (latest: {aLatestVersion})</strong>
          )}
        </small>
      </p>
    );
  };

  useEffect(() => {
    getLatestVersion().then(setLatestVersion);
  });

  const [latestVersion, setLatestVersion] = React.useState(version);

  return (
    <div>
      <h2>Nightscout will be here in {getTimeLeft(props)}</h2>
      <hr />
      <p>Need to change your settings? Click the button below:</p>
      <button onClick={resetSettings}>Open settings</button>
      <hr />
      <p>
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
      <hr />
      {showVersionTag()}
    </div>
  );
};
