// Accept the local preview supervisor's flags while preserving localhost:3000 defaults.
import { spawn } from "node:child_process";
const raw = process.argv.slice(2);
const args = [];
for (let i = 0; i < raw.length; i++) {
  if (raw[i] === "--strictPort") continue;
  if (raw[i] === "--host") {
    args.push("--hostname", raw[++i]);
    continue;
  }
  args.push(raw[i]);
}
if (!args.includes("--hostname")) args.push("--hostname", "0.0.0.0");
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", ...args],
  { stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
