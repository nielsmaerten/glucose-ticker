import React, { ChangeEvent, FormEvent } from "react";
import { AppSettings } from "../../shared/constants";
import Header from "./Header";

const SettingsForm = (props: any) => {
  const settings: AppSettings = props.state;

  const handleChange = (event: ChangeEvent<HTMLInputElement | any>) => {
    if (event.target.type === "checkbox") {
      props.onStateChange(event.target.name, event.target.checked);
    } else {
      props.onStateChange(event.target.name, event.target.value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Header />
      Nightscout URL:
      <input
        type="text"
        name="nsUrl"
        value={settings.nsUrl}
        onChange={handleChange}
      />
      Glucose unit:
      <select
        name="unit"
        id="unit"
        value={settings.unit}
        onChange={handleChange}
      >
        <option value="mg/dl">mg/dl</option>
        <option value="mmol/l">mmol/l</option>
      </select>
      {/*
      Nightscout View to show after saving (coming soon)
      <select
        name="view"
        id="view"
        value={settings.view}
        onChange={handleChange}
      >
        <option value="full">full</option>
        <option value="bgclock">clock</option>
        <option value="clock-color">color</option>
        <option value="clock">simple</option>
      </select> */}
      Background color:
      <input
        onChange={handleChange}
        value={settings.color_background}
        type="color"
        name="color_background"
        id="color_background"
      />
      In range:
      <input
        onChange={handleChange}
        value={settings.color_text_inRange}
        type="color"
        name="color_text_inRange"
        id="color_text_inRange"
      />
      Above range:
      <input
        onChange={handleChange}
        value={settings.color_text_moderate_high}
        type="color"
        name="color_text_moderate_high"
        id="color_text_moderate_high"
      />
      High:
      <input
        onChange={handleChange}
        value={settings.color_text_high}
        type="color"
        name="color_text_high"
        id="color_text_high"
      />
      Below range:
      <input
        onChange={handleChange}
        value={settings.color_text_moderate_low}
        type="color"
        name="color_text_moderate_low"
        id="color_text_moderate_low"
      />
      Low:
      <input
        onChange={handleChange}
        value={settings.color_text_low}
        type="color"
        name="color_text_low"
        id="color_text_low"
      />
      Ranges: [high, above range, below range, low]:
      <input
        onChange={handleChange}
        value={settings.range_high}
        type="number"
        name="range_high"
        id="range_high"
      />
      <input
        onChange={handleChange}
        value={settings.range_moderate_high}
        type="number"
        name="range_moderate_high"
        id="range_moderate_high"
      />
      <input
        onChange={handleChange}
        value={settings.range_moderate_low}
        type="number"
        name="range_moderate_low"
        id="range_moderate_low"
      />
      <input
        onChange={handleChange}
        value={settings.range_low}
        type="number"
        name="range_low"
        id="range_low"
      />
      <br />
      <label>
        <input
          type="checkbox"
          onChange={handleChange}
          checked={settings.start_minimized}
          name="start_minimized"
          id="start_minimized"
        />
        Start app minimized (recommended)
      </label>
      <hr />
      <input type="submit" value="Save settings" />
    </form>
  );
};
export default SettingsForm;
