import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import useStorage from "@src/shared/hooks/useStorage";
import exampleThemeStorage from "@src/shared/storages/exampleThemeStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import notGithub from "@assets/img/not-github.png";

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);

  return (
    <div className="App bg-white">
      <img src={notGithub} alt="not-github" />
      <h1 className="text-lg font-bold">
        beeep booOop! this extension only works on GitHub x_x
      </h1>
    </div>
  );
};

export default withSuspense(Popup);
