const { exec } = require("shelljs");
const find = require("find-process");
const { process_name, shutdown_timeout, check_interval_timeout } = require("../config/config");

const checkVLC = async () => {
  let list = await find("name", process_name, true);

  const time = new Date().toLocaleTimeString();

  if (list.length) {
    console.clear();
    return console.log(`[${time}] ${process_name.toUpperCase()} still runnning`);
  }

  clearInterval(AutoCheck);

  console.clear();
  console.log(`[${time}] ${process_name.toUpperCase()} not running, this device is turning off in ${shutdown_timeout}s.`);

  setTimeout(() => {
    exec("shutdown /s /f /t 3");
    process.exit(0);
  }, shutdown_timeout * 1000);

  console.log("Press any key to abort..");

  // Abort shutdown on key press
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", () => {
    console.log("\nShutdown cancelled..");
    setTimeout(() => process.exit(0), 1000);
  });
};

const AutoCheck = setInterval(() => checkVLC(), check_interval_timeout * 1000);
