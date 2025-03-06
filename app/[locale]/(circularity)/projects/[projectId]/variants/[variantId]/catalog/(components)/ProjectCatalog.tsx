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
"use client"
import _ from "lodash"
import { useTranslations } from "next-intl"
import ComponentsTree from "app/(components)/ComponentsTree"
import { NoComponentsMessage } from "app/(components)/NoComponentsMessage"
import { ElcaProjectElementRow } from "lib/domain-logic/circularity/misc/getElcaElementsForProjectId"
import { costGroupCategoryNumbersToInclude } from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ComponentWithBasicFields } from "lib/domain-logic/shared/basic-types"

type ProjectCatalogProps = {
  projectId: number
  projectComponents: ElcaProjectElementRow[]
  variantId: number
  componentUuiddsWithMissingCircularityIndexForAnyProduct: string[]
}
const ProjectCatalog = ({
  projectId,
  variantId,
  projectComponents,
  componentUuiddsWithMissingCircularityIndexForAnyProduct,
}: ProjectCatalogProps) => {
  const componentWithBasicFields: ComponentWithBasicFields[] = projectComponents.map((el) => ({
    dinComponentLevelNumber: parseInt(el.din_code),
    name: el.element_name,
    uuid: el.element_uuid,
  }))

  const componentWithBasicFieldsUnique = _.uniqBy(componentWithBasicFields, "uuid")

  const t = useTranslations("CircularityTool.sections.catalog")

  const generateLinkUrlForComponent = (uuid: string): string =>
    `/projects/${projectId}/variants/${variantId}/catalog/components/${uuid}`

  const body =
    componentWithBasicFieldsUnique.length === 0 ? (
      <NoComponentsMessage />
    ) : (
      <ComponentsTree
        components={componentWithBasicFieldsUnique}
        costGroupCategoryNumbersToInclude={costGroupCategoryNumbersToInclude}
        generateLinkUrlForComponent={generateLinkUrlForComponent}
        componentUuiddsWithMissingCircularityIndexForAnyProduct={
          componentUuiddsWithMissingCircularityIndexForAnyProduct
        }
        showIncompleteCompleteLabels={true}
      />
    )

  return (
    <div>
      <h3 className="mx-2 mb-8 text-2xl font-bold">{t("title")}</h3>
      {body}
    </div>
  )
}

export default ProjectCatalog
