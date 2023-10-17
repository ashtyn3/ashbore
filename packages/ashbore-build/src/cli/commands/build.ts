import { builder } from "../../build";
import * as p from "@clack/prompts";
import "colors";

export async function buildCmd(args) {
  let path = args.path;
  let out = args.output;

  p.intro("Building project".bold);
  let build = await builder(path, out);
  build.logs.forEach((l, i) => {
    p.log.error(l.message);
    console.log(
      "\t" +
        l.position?.file +
        ":" +
        l.position?.line.toString().cyan +
        ":" +
        l.position?.offset.toString().cyan
    );
  });
  p.outro("Finished build".bold);
}
