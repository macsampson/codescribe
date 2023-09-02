import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import useStorage from "@src/shared/hooks/useStorage";
import exampleThemeStorage from "@src/shared/storages/exampleThemeStorage";
import withSuspense from "@src/shared/hoc/withSuspense";

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div className="App">
      <div>This extension only works on GitHub x_x</div>
    </div>
  );
};

export default withSuspense(Popup);
