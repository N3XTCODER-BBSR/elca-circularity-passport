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
