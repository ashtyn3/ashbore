#!/usr/bin/env bun

import { argv } from "bun";
import { buildCmd } from "./commands/build";
import yargs from "yargs";

let y = yargs(argv.slice(2))
  .usage("ashbore")
  .scriptName("ashbore")
  .command(
    "build <path> [options]",
    "builds project",
    (a) => {
      a.positional("path", {
        describe: "input file path",
        type: "string",
        default: "./index.tsx",
        demandOption: true,
      }).option("output", {
        describe: "output path",
        default: "./",
      });
    },
    buildCmd
  )
  .demandCommand()
  .fail(async () => {
    console.log((await y.getHelp()).white);
  });
y.parse();
