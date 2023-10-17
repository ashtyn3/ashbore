import { log } from "@clack/prompts";

export function errorLog(
  message: string,
  file: string,
  line: number,
  offset: number
) {
  log.error(message);
  console.log(
    "\t" + file + ":" + line.toString().cyan + ":" + offset.toString().cyan
  );
}
