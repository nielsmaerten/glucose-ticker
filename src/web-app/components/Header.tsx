import { version } from "../../../package.json";
import React from "react";

export default () => {
  return (
    <div>
      <h1>
        Glucose Ticker :: <small>{version}</small>
      </h1>
      <p>
        <strong>
          This app is a work in progress, but basic functionality should work.
          <br />
          Thanks for trying it out!
        </strong>
      </p>
      <hr />
    </div>
  );
};
