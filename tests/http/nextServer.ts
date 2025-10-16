import { type ChildProcess, spawn } from "node:child_process"
import net from "node:net"

export type StartedNextServer = { url: string; close: () => Promise<void> }

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.on("error", reject)
    srv.listen(0, () => {
      const address = srv.address()
      const port = typeof address === "object" && address ? address.port : 0
      srv.close(() => resolve(port))
    })
  })
}

async function waitForHttp(url: string, timeoutMs = 60_000): Promise<void> {
  const start = Date.now()
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    if (Date.now() - start > timeoutMs) throw new Error(`Timeout waiting for ${url}`)
    await new Promise((r) => setTimeout(r, 300))
  }
}

export async function startNextForTests(extraEnv?: Record<string, string>): Promise<StartedNextServer> {
  const port = await getFreePort()
  const url = `http://localhost:${port}`

  const env = { ...process.env, ...(extraEnv ?? {}), PORT: String(port) }
  const proc: ChildProcess = spawn(
    process.execPath,
    [require.resolve("next/dist/bin/next"), "dev", "-p", String(port)],
    { env, stdio: ["ignore", "pipe", "pipe"] }
  )

  proc.stdout?.on("data", () => {})
  proc.stderr?.on("data", () => {})

  await waitForHttp(`${url}/api/health`)

  return {
    url,
    close: async () => {
      return new Promise<void>((resolve) => {
        proc.once("exit", () => resolve())
        proc.kill()
        setTimeout(() => resolve(), 2_000)
      })
    },
  }
}
