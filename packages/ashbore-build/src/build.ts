import { BuildOutput } from "bun";
import ashbore from "./plugin";
import { log } from "@clack/prompts";

// await Bun.plugin(ashbore)

export async function builder(
  path: string,
  outdir: string,
): Promise<BuildOutput> {
  log.step("building " + path);
  let res = await Bun.build({
    entrypoints: [path],
    outdir: outdir,
    plugins: [ashbore],
    target: "bun",
    splitting: true,
    publicPath: "/",
    // minify: true,
  });

  return res;
}
