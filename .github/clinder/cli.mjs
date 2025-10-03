import { Command } from "commander";

import { startBinder } from "./lib.mjs";

const program = new Command();

program
  .name("clinder")
  .description("A simple CLI tool to load a BinderHub session")
  .version("0.0.0");

program
  .argument("binderhub <url>", "BinderHub URL")
  .requiredOption("--github-repo <repo>", "GitHub repo")
  .option("--github-ref <ref>", "GitHub ref", "HEAD")
  .option("--json", "GitHub ref", "HEAD")
  .action(async (binderhub, options) => {
    const result = await startBinder(binderhub, options);
    if (options.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(
        `BinderHub started at ${result.url} with token ${result.token}`,
      );
    }
  });

program.parse(process.argv);
