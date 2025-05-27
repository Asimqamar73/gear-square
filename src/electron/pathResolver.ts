import { app } from "electron";
import { isDev } from "./util.js";
import path from "path";

export function getPreloadath() {
  return path.join(app.getAppPath(), isDev() ? "." : "..", "/dist-electron/electron/preload.cjs");
}
