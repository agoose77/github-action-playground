import * as core from "@actions/core";
import * as github from "@actions/github";

import { writeFileSync } from "node:fs";
import { startBinder } from "./lib.mjs";

async function main() {
  try {
    const hubUrl = core.getInput("hub-url");
    const githubRepo = core.getInput("repo") ?? github.repository;
    const githubRef = core.getInput("ref");
    const spec = { githubRepo, githubRef };
    const response = await startBinder(hubUrl, spec);

    core.setOutput("url", response.url);
    core.setOutput("token", response.token);

    const envFile = process.env.GITHUB_ENV;
    const data = `JUPYTER_BASE_URL=${response.url}\nJUPYTER_TOKEN=${response.token}`;
    writeFileSync(envFile, data, { encoding: "utf-8", flag: "a" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
