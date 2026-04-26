import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./styles/tokens.css";
import "./styles/global.css";

const THEME_STORAGE_KEY = "manabi-theme";
const DARK_THEME_CLASS = "theme-dark";

function applyInitialTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDarkTheme = savedTheme ? savedTheme === "dark" : prefersDark;

  document.documentElement.classList.toggle(DARK_THEME_CLASS, useDarkTheme);
}

applyInitialTheme();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
