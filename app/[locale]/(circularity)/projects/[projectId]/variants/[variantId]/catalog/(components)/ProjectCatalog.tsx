"use client"
import _ from "lodash"
import ComponentsTree from "app/(components)/ComponentsTree"
import { ElcaProjectElementRow } from "lib/domain-logic/circularity/server-actions/getElcaElementsForProjectId"
import { costGroupCategoryNumbersToInclude } from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ComponentWithBasicFields } from "lib/domain-logic/shared/basic-types"

type ProjectCatalogProps = {
  projectId: number
  projectComponents: ElcaProjectElementRow[]
  variantId: number
}
const ProjectCatalog = ({ projectId, variantId, projectComponents }: ProjectCatalogProps) => {
  const componentWithBasicFields: ComponentWithBasicFields[] = projectComponents.map((el) => ({
    dinComponentLevelNumber: parseInt(el.din_code),
    name: el.element_name,
    uuid: el.element_uuid,
  }))

  const componentWithBasicFieldsUnique = _.uniqBy(componentWithBasicFields, "uuid")

  const generateLinkUrlForComponent = (uuid: string): string =>
    `/projects/${projectId}/variants/${variantId}/catalog/components/${uuid}`

  return (
    <div>
      <ComponentsTree
        components={componentWithBasicFieldsUnique}
        costGroupCategoryNumbersToInclude={costGroupCategoryNumbersToInclude}
        generateLinkUrlForComponent={generateLinkUrlForComponent}
      />
    </div>
  )
}

export default ProjectCatalog
