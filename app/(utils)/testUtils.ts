import ensureUserIsAuthenticated from "lib/ensureAuthenticated"

export const createMockSession = (userId: number): Awaited<ReturnType<typeof ensureUserIsAuthenticated>> => ({
  user: { id: String(userId), auth_name: "" },
  expires: "",
})
