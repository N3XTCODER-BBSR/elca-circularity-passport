import { UnauthorizedError } from "lib/errors"
import { createUser, createVariant, deleteUserIfExists, deleteVariantIfExists } from "prisma/queries/utils"
import getElcaComponentDataByLayerId from "./getElcaComponentDataByLayerId"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

const unauthenticatedUserId = 1000
const unauthorizedUserId = 1001
const unauthorizedUsername = "unauthorizedUserName"
const authorizedUserId = 2

const projectId = 1
const variantId = 1
const layerId = 1

const layerIdNotInProject = 8
const variantIdNotInProject = 1000

const getSession = (userId: number): Awaited<ReturnType<typeof ensureUserIsAuthenticated>> => ({
  user: { id: String(userId), auth_name: "" },
  expires: "",
})

describe("getElcaComponentDataByLayerId", () => {
  beforeAll(async () => {
    await createUser(unauthorizedUserId, unauthorizedUsername)
    await createVariant(variantIdNotInProject, projectId)
  })
  afterAll(async () => {
    await deleteUserIfExists(unauthorizedUserId)
    await deleteVariantIfExists(variantIdNotInProject)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("should throw Unauthorized error when user is unauthenticated", async () => {
    const mockSession = getSession(unauthenticatedUserId)
    ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

    await expect(getElcaComponentDataByLayerId(variantId, projectId, layerId)).rejects.toThrow(UnauthorizedError)
  })
  it("should throw Unauthorized error when user is unauthorized to project", async () => {
    const mockSession = getSession(unauthorizedUserId)
    ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

    await expect(getElcaComponentDataByLayerId(variantId, projectId, layerId)).rejects.toThrow(UnauthorizedError)
  })
  it("should throw when user is authorized and element component is not part of project", async () => {
    const mockSession = getSession(authorizedUserId)
    ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

    await expect(getElcaComponentDataByLayerId(variantId, projectId, layerIdNotInProject)).rejects.toThrow()
  })
  it("should throw when user is authorized and variant is not part of project", async () => {
    const mockSession = getSession(authorizedUserId)
    ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

    await expect(getElcaComponentDataByLayerId(variantIdNotInProject, projectId, layerId)).rejects.toThrow()
  })
  it("should return element component data when user is authorized and element component is part of project", async () => {
    const mockSession = getSession(authorizedUserId)
    ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

    const result = await getElcaComponentDataByLayerId(variantId, projectId, layerId)

    expect(result).toBeTruthy()
  })
})
