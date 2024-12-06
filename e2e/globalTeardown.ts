import { execSync } from "node:child_process"

const main = async () => {
  if (process.env.CI) {
    execSync("docker compose --profile e2e-tests down", { stdio: "ignore" })
  }
}

export default main
