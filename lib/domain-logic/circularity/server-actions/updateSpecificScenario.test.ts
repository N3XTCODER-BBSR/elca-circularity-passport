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
import { updateSpecificEolScenario } from "./updateSpecificScenario"
import ensureUserIsAuthenticated from "../../../../lib/ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

describe("updateSpecificEolScenario", () => {
  // USER1 (assumed via seed data, owner of project1)
  const project1Id = 1
  const user1Id = 2
  const product1Id = 1
  const group1Id = 3 // Access group for project1

  // USER2 (created in test, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104

  // USER3 (created in test, regular user not an owner of any project)
  const user3Id = 200
  const user3Username = "user3"
  const product3Id = 202
  const component3Id = 203

  // IDs for testing invalid/unauthorized scenarios
  const notExistingUserId = 1000

  // Scenario arguments
  const newSpecificEolScenario = "CL_MINUS"
  const newProofText = "proof"

  describe("authorization", () => {
    beforeAll(async () => {
      // Create second user (owner of second project)
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)

      // Create third user (regular user, no project ownership)
      await createUser(user3Id, user3Username)
      await createProductWithComponent(product3Id, component3Id)
    })

    afterAll(async () => {
      // Clean up second user’s project/resources
      await deleteProjectIfExists(project2Id)
      await deleteUserIfExists(user2Id)
      await deleteProductIfExists(product2Id)
      await deleteComponentIfExists(component2Id)
      await deleteAccessGroupIfExists(group2Id)

      // Clean up third user’s product/resources
      await deleteUserIfExists(user3Id)
      await deleteProductIfExists(product3Id)
      await deleteComponentIfExists(component3Id)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("throws UnauthorizedError if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user lacks project access", async () => {
      // user2 is an owner of project2, not project1
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws ZodError if productId is null", async () => {
      const mockSession = createMockSession(user1Id) // project owner
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error Testing null
        updateSpecificEolScenario(null, newSpecificEolScenario, newProofText)
      ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.validation" })
    })

    it("throws ZodError if productId is undefined", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error Testing undefined
        updateSpecificEolScenario(undefined, newSpecificEolScenario, newProofText)
      ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.validation" })
    })

    it("throws ZodError if productId is not a number", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        // @ts-expect-error Testing string
        updateSpecificEolScenario("invalidProductId", newSpecificEolScenario, newProofText)
      ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.validation" })
    })

    it("throws UnauthorizedError if user is the project owner but the product is not in that project", async () => {
      // user1 is owner of project1, but product2 belongs to project2
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(product2Id, newSpecificEolScenario, newProofText)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user is in a group that lacks project access", async () => {
      // user3 is not in any group that controls project1 by default
      const mockSession = createMockSession(user3Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(product3Id, newSpecificEolScenario, newProofText)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // Give user3 a token for project1 but only read-access
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("throws UnauthorizedError if user holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)
        ).resolves.toMatchObject({ success: false, errorI18nKey: "errors.unauthorized" })
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)
        ).resolves.toMatchObject({ success: true, data: undefined })
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

      it("resolves if user belongs to an authorized access group", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)
        ).resolves.toMatchObject({ success: true, data: undefined })
      })
    })

    it("resolves if user is the project owner", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateSpecificEolScenario(product1Id, newSpecificEolScenario, newProofText)).resolves.toMatchObject({
        success: true,
        data: undefined,
      })
    })
  })
})
