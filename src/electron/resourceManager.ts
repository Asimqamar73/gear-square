import osUtils from "os-utils";
import os from "os";
import { BrowserWindow } from "electron";
const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    mainWindow.webContents.send("statistics", { cpuUsage, ramUsage });
  }, POLLING_INTERVAL);
}
function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

export function getStaticData() {
  const cpuModel = os.cpus()[0].model;
  const totalMemGB = Math.floor(osUtils.totalmem() / 1024);

  return { cpuModel, totalMemGB };
}
