import { ipcMain } from "electron";
import fsuipc from "fsuipc";

let obj = null;
let conn = null;
let timerFSUIPC;
let touchdownfpm = null;
const carryall = [];

const addOffsets = () => {
  conn.add("lat", 0x0560, fsuipc.Type.Int64);
  conn.add("lon", 0x0568, fsuipc.Type.Int64);
  conn.add("alt", 0x0574, fsuipc.Type.Int32);
  conn.add("kias", 0x02bc, fsuipc.Type.Int32);
  conn.add("gndspd", 0x02b4, fsuipc.Type.Int32);
  conn.add("simver", 0x3308, fsuipc.Type.Int16);
  conn.add("otherver", 0x3124, fsuipc.Type.Int16);
  conn.add("presalt", 0x3324, fsuipc.Type.Int32);
  conn.add("baro", 0x0f48, fsuipc.Type.Int16);
  conn.add("fuelLb", 0x126c, fsuipc.Type.Int32);
  conn.add("magvar", 0x02a0, fsuipc.Type.Int16);
  conn.add("hdgTrue", 0x0580, fsuipc.Type.Int32);

  conn.add("eng1N1", 0x0898, fsuipc.Type.Int16);
  conn.add("eng2N1", 0x0930, fsuipc.Type.Int16);
  conn.add("eng3N1", 0x09c8, fsuipc.Type.Int16);
  conn.add("eng4N1", 0x0a60, fsuipc.Type.Int16);
  conn.add("parkingbrake", 0x0bc8, fsuipc.Type.Int16);

  conn.add("vertSpeed", 0x030c, fsuipc.Type.Int32);
  conn.add("onground", 0x0366, fsuipc.Type.Int16);

  conn.add("flappositions", 0x3bf8, fsuipc.Type.Int16); // Number of positions minus full up (0)
  conn.add("flapdetent", 0x3bfa, fsuipc.Type.Int16); // 16383/(flapdetent) + 1
  conn.add("gear", 0x0be8, fsuipc.Type.Int32); // 0 = up, 16383 = down
};

const closeFSUIPC = () => {
  if (timerFSUIPC !== undefined) {
    clearInterval(timerFSUIPC);
    timerFSUIPC = undefined;
  }
  ipcMain.emit("fsuipc", { type: "closed" });
  return obj.close();
};

const doLoop = async () => {
  let result;
  try {
    result = await conn.process();
  } catch (error) {
    closeFSUIPC();
  }

  result.lat = Math.round(((result.lat * 90.0) / (10001750.0 * 65536.0 * 65536.0)) * 1000) / 1000;
  result.lon =
    Math.round(((result.lon * 360.0) / (65535.0 * 65536.0 * 65536.0 * 65536.0)) * 1000) / 1000;
  result.alt = Math.floor(result.alt * 3.2808399);
  result.hPa = Math.round((result.baro / 16) * 100) / 100;
  result.in = Math.round(result.hPa * 0.02953 * 100) / 100;
  result.fuelKg = Math.round(result.fuelLb * 0.45359237);
  result.gndspd = Math.round((result.gndspd / 65536) * 1.94384449);
  result.kias = Math.round(result.kias / 128);
  result.magvar = Math.round(((result.magvar * 360) / 65536) * 10) / 10;
  result.hdgTrue = Math.round((result.hdgTrue * 360) / 4294967296.0);
  result.vertSpeed = Math.round(((result.vertSpeed * 60 * 3.28084) / 256) * 100) / 100;

  result.eng1N1clean = `${
    result.eng1N1 > 0 ? `${Math.round((result.eng1N1 / 16384) * 1000) / 10}%` : "Off"
  }`;
  result.eng2N1clean = `${
    result.eng2N1 > 0 ? `${Math.round((result.eng2N1 / 16384) * 1000) / 10}%` : "Off"
  }`;
  result.eng3N1clean = `${
    result.eng3N1 > 0 ? `${Math.round((result.eng3N1 / 16384) * 1000) / 10}%` : "Off"
  }`;
  result.eng4N1clean = `${
    result.eng4N1 > 0 ? `${Math.round((result.eng4N1 / 16384) * 1000) / 10}%` : "Off"
  }`;

  result.started = !(
    result.eng1N1 === 0 &&
    result.eng2N1 === 0 &&
    result.eng3N1 === 0 &&
    result.eng4N1 === 0 &&
    result.parkingbrake === 32767
  );
  result.carryall = carryall;

  if (touchdownfpm !== result.vertSpeed && result.vertSpeed < 0 && result.onground === 1) {
    carryall.push(`Touchdown!!! ${result.vertSpeed}`);
    touchdownfpm = result.vertSpeed;
  }

  if (result.hdgTrue < 0.0) {
    result.hdgTrue += 360;
  }
  result.hdg = Math.round(result.hdgTrue - result.magvar);

  ipcMain.emit("fsuipc", { type: "data", data: result });
};

const startFSUIPC = () => {
  obj = new fsuipc.FSUIPC();
  obj
    .open()
    .then(connection => {
      conn = connection;
      addOffsets();
      timerFSUIPC = setInterval(doLoop, 250);
    })
    .catch(() => {
      setTimeout(startFSUIPC, 2000);
      return closeFSUIPC();
    });
};

const setupFSUIPCListeners = () => {
  console.log("Setting up FSUIPC Listeners");
  ipcMain.on("fsuipc", (event, arg) => {
    switch (arg.type) {
      case "start":
        startFSUIPC();
        break;
      case "stop":
        closeFSUIPC();
        break;
      default:
        console.log("Invalid fsuipc message");
        break;
    }
  });
};

export default setupFSUIPCListeners;
