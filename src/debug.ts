import fs from "fs";
import util from "util";
import path from "path";
import { homedir } from "os";

const debugLogFile = path.resolve(homedir(), "node-debug.log");

export const dump = (obj: unknown) => {
  fs.appendFileSync(
    debugLogFile,
    `${new Date().toLocaleTimeString()}: ${util.inspect(obj)}\n`,
  );
};
