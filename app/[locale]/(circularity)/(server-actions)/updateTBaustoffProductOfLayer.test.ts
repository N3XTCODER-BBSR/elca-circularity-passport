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
  createTBsProductDefinition,
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
import { updateTBaustoffProduct } from "./updateTBaustoffProductOfLayer"
import ensureUserIsAuthenticated from "../../../../lib/auth/ensureAuthenticated"

jest.mock("../../../../lib/auth/ensureAuthenticated", () => jest.fn())

describe("updateTBaustoffProduct", () => {
  // USER1 (seed-based, presumed owner of project1)
  const project1Id = 1
  const user1Id = 2
  const product1Id = 13
  const group1Id = 3

  // USER2 (test-created, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104

  // USER3 (test-created, regular user)
  const user3Id = 200
  const user3Username = "user3"
  const product3Id = 202
  const component3Id = 203

  // Extra IDs
  const notExistingUserId = 1000
  const tbProductDefinitionId = 1

  describe("authorization", () => {
    beforeAll(async () => {
      // Set up second user (project2 owner)
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)

      // Set up third user (no project ownership)
      await createUser(user3Id, user3Username)
      await createProductWithComponent(product3Id, component3Id)

      // Create TB product definition
      await createTBsProductDefinition(tbProductDefinitionId)
    })

    afterAll(async () => {
      // Cleanup user2’s data
      await deleteProjectIfExists(project2Id)
      await deleteUserIfExists(user2Id)
      await deleteProductIfExists(product2Id)
      await deleteComponentIfExists(component2Id)
      await deleteAccessGroupIfExists(group2Id)

      // Cleanup user3’s data
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

      await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user lacks project access", async () => {
      // user2 has project2, not project1
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws ZodError if productId is null", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error Testing null
      await expect(updateTBaustoffProduct(null, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws ZodError if productId is undefined", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error Testing undefined
      await expect(updateTBaustoffProduct(undefined, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws ZodError if productId is not a number", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // @ts-expect-error Testing string
      await expect(updateTBaustoffProduct("invalidProductId", tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.validation",
      })
    })

    it("throws UnauthorizedError if user is the project owner but the product is not part of that project", async () => {
      // user1 owns project1, but product2 belongs to project2
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(product2Id, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    it("throws UnauthorizedError if user is in a group that lacks project access", async () => {
      // user3 initially has no access to project1 or project2
      const mockSession = createMockSession(user3Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(product3Id, tbProductDefinitionId)).resolves.toMatchObject({
        success: false,
        errorI18nKey: "errors.unauthorized",
      })
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // Grant user3 a read-only token for project1
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("throws UnauthorizedError if user holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
          success: false,
          errorI18nKey: "errors.unauthorized",
        })
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
          success: true,
          data: undefined,
        })
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        // user3 joins the group for project1
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves if user belongs to an authorized group", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
          success: true,
          data: undefined,
        })
      })
    })

    it("resolves if user is the project owner of the product", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(updateTBaustoffProduct(product1Id, tbProductDefinitionId)).resolves.toMatchObject({
        success: true,
        data: undefined,
      })
    })
  })
})
