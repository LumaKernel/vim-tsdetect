import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import { parseReadmeMd } from "../src/utils/readme";
import { applyOptionDeclarations } from "../src/utils/package-json";

const readmeMdPath = path.resolve(__dirname, "../README.md");
const packageJsonPath = path.resolve(__dirname, "../package.json");

const readmeLines = fs.readFileSync(readmeMdPath).toString().split("\n");
const packageJsonContent = JSON.parse(
  fs.readFileSync(packageJsonPath).toString(),
);

const parseReadme = parseReadmeMd(readmeLines);
const appliedJson = applyOptionDeclarations(
  packageJsonContent as any,
  parseReadme,
);
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(appliedJson as any, null, "  "),
);

execFileSync("yarn", ["fix", "./package.json"]);
