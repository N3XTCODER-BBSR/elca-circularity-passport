/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
import { createMockSession } from "app/(utils)/testUtils"
import {
  createAccessGroup,
  createGroupMember,
  createProductWithComponent,
  createProject,
  createProjectAccessToken,
  createUser,
  deleteAccessGroupIfExists,
  deleteComponentIfExists,
  deleteGroupMemberIfExists,
  deleteProductIfExists,
  deleteProjectAccessTokenIfExists,
  deleteProjectIfExists,
  deleteUserIfExists,
  setProjectAccessTokenToEditTrue,
} from "prisma/queries/testUtils"
import { updateDisturbingEolScenarioForS4 } from "./updateDisturbingEolScenarioForS4"
import ensureUserIsAuthenticated from "../../../../lib/auth/ensureAuthenticated"

jest.mock("../../../../lib/auth/ensureAuthenticated", () => jest.fn())

describe("updateDisturbingEolScenarioForS4", () => {
  // USER1 (seed-based, presumed project1 owner)
  const project1Id = 1
  const user1Id = 2
  const product1Id = 13
  const group1Id = 3

  // USER2 (created in test, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104

  // USER3 (created in test, no project ownership)
  const user3Id = 200
  const user3Username = "user3"
  const product3Id = 202
  const component3Id = 203

  // Additional
  const notExistingUserId = 1000
  const unauthorizedUserId = 1001
  const unauthorizedUsername = "unauthorizedUserName"

  // Test data
  const productIdNotInAuthorizedProject = 100
  const newScenario = null

  describe("authorization", () => {
    beforeAll(async () => {
      // 1) Create user2, their project2, product2
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)

      // 2) Create user3, product3
      await createUser(user3Id, user3Username)
      await createProductWithComponent(product3Id, component3Id)

      // 3) Create an unauthorized user
      await createUser(unauthorizedUserId, unauthorizedUsername)
    })

    afterAll(async () => {
      // Cleanup user2 resources
      await deleteProjectIfExists(project2Id)
      await deleteUserIfExists(user2Id)
      await deleteProductIfExists(product2Id)
      await deleteComponentIfExists(component2Id)
      await deleteAccessGroupIfExists(group2Id)

      // Cleanup user3 resources
      await deleteUserIfExists(user3Id)
      await deleteProductIfExists(product3Id)
      await deleteComponentIfExists(component3Id)

      // Cleanup unauthorized user
      await deleteUserIfExists(unauthorizedUserId)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("throws UnauthorizedError if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user lacks project access", async () => {
      // user2 only owns project2, not project1
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user is not in the project at all", async () => {
      // unauthorizedUserId
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws ZodError if product id is null", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error intentionally testing null
      await expect(updateDisturbingEolScenarioForS4(null, newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws ZodError if product id is undefined", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error intentionally testing undefined
      await expect(updateDisturbingEolScenarioForS4(undefined, newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws ZodError if product id is not a number", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error intentionally passing string
      await expect(updateDisturbingEolScenarioForS4("invalidProductId", newScenario)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws UnauthorizedError if user is project owner but product id is not part of project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        updateDisturbingEolScenarioForS4(productIdNotInAuthorizedProject, newScenario)
      ).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // Provide user3 a read-only token for project1
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("throws UnauthorizedError if user holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
          success: false,
          errorI18nKey: "errors.unauthorized",
        })
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
          success: true,
          data: undefined,
        })
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        // Add user3 to the group that owns project1
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves if user belongs to an authorized group for the product's project", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
          success: true,
          data: undefined,
        })
      })
    })

    it("resolves if user is the project owner and product is part of their project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateDisturbingEolScenarioForS4(product1Id, newScenario)).resolves.toMatchObject({
        success: true,
        data: undefined,
      })
    })
  })
})
