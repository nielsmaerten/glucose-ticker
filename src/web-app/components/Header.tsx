import { version } from "../../../package.json";
import React from "react";

export default () => {
  return (
    <div>
      <h2>Glucose Ticker</h2>
      <h6>v{version}</h6>
      <br />
    </div>
  );
};
