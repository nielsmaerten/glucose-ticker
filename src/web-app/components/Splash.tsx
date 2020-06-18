import React from "react";
import * as storage from "idb-keyval";
import { STORAGE_KEY } from "../../shared/constants";

export default (props: any) => {
  const resetSettings = async () => {
    await storage.del(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div>
      <button onClick={resetSettings}>
        Click here if you want to change settings
      </button>
      <h2>
        Showing your Nightscout status in {props.s}{" "}
        {props.s === 1 ? "second" : "seconds"}
      </h2>
    </div>
  );
};
