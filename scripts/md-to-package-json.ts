import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import equal from "deep-equal";
import { parseReadmeMd } from "../src/utils/readme";
import { applyOptionDeclarations } from "../src/utils/package-json";

const exitCode = process.argv.slice(1).includes("--exit-code");
if (exitCode) {
  console.info("Exit code mode is on.");
}

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
//
if (exitCode) {
  if (!equal(appliedJson, packageJsonContent)) {
    console.error("md-to-package-json.ts is not applied.");
    process.exit(1);
  }
} else {
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(appliedJson as any, null, "  "),
  );
  execFileSync("yarn", ["eslint", "--fix", packageJsonPath], {
    stdio: "inherit",
  });
}
