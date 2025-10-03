import * as core from "@actions/core";

import { stopBinder } from "./lib.mjs";

async function main() {
  try {
    const url = core.getInput("url");
    const token = core.getInput("token");

    if (!url || !token) {
      throw new Error("Need url and token");
    }

    await stopBinder({ url, token });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
