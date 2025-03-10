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
import { DisturbingSubstanceSelectionWithNullabelId } from "lib/domain-logic/types/domain-types"
import {
  createAccessGroup,
  createDisturbingSubstanceSelectionWithDependencies,
  createGroupMember,
  createProductWithComponent,
  createProject,
  createProjectAccessToken,
  createUser,
  createVariant,
  deleteAccessGroupIfExists,
  deleteDisturbingSubstanceSelectionWithDependenciesIfExist,
  deleteGroupMemberIfExists,
  deleteProductIfExists,
  deleteProjectAccessTokenIfExists,
  deleteProjectIfExists,
  deleteUserIfExists,
  deleteVariantIfExists,
  setProjectAccessTokenToEditTrue,
} from "prisma/queries/testUtils"
import { addOrUpdateDisturbingSubstanceSelection } from "./addOrUpdateDisturbingSubstance"
import ensureUserIsAuthenticated from "../../../ensureAuthenticated"

jest.mock("../../../../lib/ensureAuthenticated", () => jest.fn())

describe("addOrUpdateDisturbingSubstanceSelection", () => {
  // USER1 (seed-based, presumed owner of project1)
  const project1Id = 1
  const user1Id = 2
  const group1Id = 3
  const variant1Id = 1
  const product1Id = 13

  // USER2 (test-created, owner of project2)
  const project2Id = 100
  const user2Id = 101
  const user2Username = "user2Username"
  const product2Id = 102
  const component2Id = 103
  const group2Id = 104
  const variant2Id = 105

  // USER3 (regular user)
  const user3Id = 200
  const user3Username = "user3"

  // Additional references
  const notExistingUserId = 1000
  const unauthorizedUserId = 1001
  const unauthorizedUsername = "unauthorizedUserName"

  const productIdNotInAuthorizedProject = 100
  const variantIdNotInProject = 1000

  // Disturbing substance test object
  let disturbingSubstanceSelectionId: number
  let disturbingSubstanceSelection: DisturbingSubstanceSelectionWithNullabelId = {
    disturbingSubstanceClassId: "S0",
    disturbingSubstanceName: null,
    id: null,
    userEnrichedProductDataElcaElementComponentId: 6,
  }
  let elcaComponentId: number | undefined

  describe("authorization", () => {
    beforeAll(async () => {
      // 1) Create user2 and project2
      await createUser(user2Id, user2Username)
      await createAccessGroup(group2Id)
      await createProject(project2Id, group2Id, user2Id)
      await createProductWithComponent(product2Id, component2Id)
      await createVariant(variant2Id, project2Id)

      // 2) Create user3, no project ownership
      await createUser(user3Id, user3Username)

      // 3) Create unauthorized user
      await createUser(unauthorizedUserId, unauthorizedUsername)

      // 4) Create a variant not in project1 (belongs to project2)
      await createVariant(variantIdNotInProject, project2Id)

      // 5) Create a DisturbingSubstanceSelection with dependencies
      const result = await createDisturbingSubstanceSelectionWithDependencies()
      disturbingSubstanceSelectionId = result.id
      elcaComponentId = result.userEnrichedProductDataElcaElementComponentId
      // Make sure the test object has the correct ID
      disturbingSubstanceSelection = {
        ...disturbingSubstanceSelection,
        id: disturbingSubstanceSelectionId,
      }
    })

    afterAll(async () => {
      // Cleanup project2 and user2
      await deleteProjectIfExists(project2Id)
      await deleteVariantIfExists(variant2Id)
      await deleteProductIfExists(product2Id)
      await deleteAccessGroupIfExists(group2Id)
      await deleteUserIfExists(user2Id)

      // Cleanup user3
      await deleteUserIfExists(user3Id)

      // Cleanup unauthorized user
      await deleteUserIfExists(unauthorizedUserId)

      // Cleanup variant not in project1
      await deleteVariantIfExists(variantIdNotInProject)
      if (typeof disturbingSubstanceSelectionId === "number" && typeof elcaComponentId === "number") {
        await deleteDisturbingSubstanceSelectionWithDependenciesIfExist(disturbingSubstanceSelectionId, elcaComponentId)
      }
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("it returns unauthorized errorI18nKey if user does not exist", async () => {
      const mockSession = createMockSession(notExistingUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
      ).resolves.toMatchObject({ errorI18nKey: "errors.unauthorized", success: false })
    })

    it("it returns unauthorized errorI18nKey if user lacks project access", async () => {
      // user2 only has project2
      const mockSession = createMockSession(user2Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
      ).resolves.toMatchObject({ errorI18nKey: "errors.unauthorized", success: false })
    })

    it("it returns unauthorized errorI18nKey if user is not part of the project (unauthorized user)", async () => {
      const mockSession = createMockSession(unauthorizedUserId)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
      ).resolves.toMatchObject({ errorI18nKey: "errors.unauthorized", success: false })
    })

    describe("Zod validations for productId", () => {
      it("throws ZodError if product id is null or undefined", async () => {
        const mockSession = createMockSession(user1Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        // null
        await expect(
          // @ts-expect-error Testing null
          addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, null, disturbingSubstanceSelection)
        ).resolves.toMatchObject({ errorI18nKey: "errors.validation", success: false })

        // undefined
        await expect(
          // @ts-expect-error Testing undefined
          addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, undefined, disturbingSubstanceSelection)
        ).resolves.toMatchObject({ errorI18nKey: "errors.validation", success: false })
      })

      it("throws ZodError if product id is not a number", async () => {
        const mockSession = createMockSession(user1Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          addOrUpdateDisturbingSubstanceSelection(
            variant1Id,
            project1Id,
            // @ts-expect-error Testing string
            "invalidProductId",
            disturbingSubstanceSelection
          )
        ).resolves.toMatchObject({ errorI18nKey: "errors.validation", success: false })
      })
    })

    it("returns DB error errorI18nKey user is project owner but variant is not part of project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // variantIdNotInProject references project2
      await expect(
        addOrUpdateDisturbingSubstanceSelection(
          variantIdNotInProject,
          project1Id,
          product1Id,
          disturbingSubstanceSelection
        )
      ).resolves.toMatchObject({ errorI18nKey: "errors.db", success: false })
    })

    it("it returns unauthorized errorI18nKey if user is project owner but product id is not part of project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      // productIdNotInAuthorizedProject belongs to a different project or not at all
      await expect(
        addOrUpdateDisturbingSubstanceSelection(
          variant1Id,
          project1Id,
          productIdNotInAuthorizedProject,
          disturbingSubstanceSelection
        )
      ).resolves.toMatchObject({ errorI18nKey: "errors.unauthorized", success: false })
    })

    describe("access tokens", () => {
      beforeAll(async () => {
        // user3 gets a read-only token for project1
        await createProjectAccessToken(project1Id, user3Id, false)
      })

      afterAll(async () => {
        await deleteProjectAccessTokenIfExists(project1Id, user3Id)
      })

      it("it returns unauthorized errorI18nKey if user only holds a read-only token", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
        ).resolves.toMatchObject({ errorI18nKey: "errors.unauthorized", success: false })
      })

      it("resolves if user holds an edit-access token", async () => {
        await setProjectAccessTokenToEditTrue(project1Id, user3Id)
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
        ).resolves.toBeTruthy()
      })
    })

    describe("user groups", () => {
      beforeAll(async () => {
        // Add user3 to group1 => project1
        await createGroupMember(user3Id, group1Id)
      })

      afterAll(async () => {
        await deleteGroupMemberIfExists(user3Id, group1Id)
      })

      it("resolves if user belongs to an authorized group", async () => {
        const mockSession = createMockSession(user3Id)
        ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

        await expect(
          addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
        ).resolves.toBeTruthy()
      })
    })

    it("resolves if user is the project owner and the product/variant are within that project", async () => {
      const mockSession = createMockSession(user1Id)
      ;(ensureUserIsAuthenticated as jest.Mock).mockResolvedValue(mockSession)

      await expect(
        addOrUpdateDisturbingSubstanceSelection(variant1Id, project1Id, product1Id, disturbingSubstanceSelection)
      ).resolves.toBeTruthy()
    })
  })
})
