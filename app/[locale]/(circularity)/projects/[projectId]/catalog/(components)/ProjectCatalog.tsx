"use client"
import _ from "lodash"
import { ElcaProjectComponent } from "app/[locale]/(circularity)/(utils)/types"
import ComponentsTree from "app/(components)/ComponentsTree"
import { ComponentWithBasicFields } from "domain-logic/grp/data-schema/versions/v1/mergeDin276HierarchyWithBuildingComponents"

type ProjectCatalogProps = {
  projectId: string
  projectComponents: ElcaProjectComponent[]
}
const ProjectCatalog = ({ projectId, projectComponents }: ProjectCatalogProps) => {
  const componentWithBasicFields: ComponentWithBasicFields[] = projectComponents.map((el) => ({
    dinComponentLevelNumber: parseInt(el.din_code),
    name: el.element_name,
    uuid: el.element_uuid,
  }))

  const componentWithBasicFieldsUnique = _.uniqBy(componentWithBasicFields, "uuid")

  // TODO: extract this out (e.g. into or close to data schema?)
  const categoryNumbersToInclude = [320, 330, 340, 350, 360]

  const generateLinkUrlForComponent = (uuid: string): string => `/projects/${projectId}/catalog/components/${uuid}`

  return (
    <div>
      <ComponentsTree
        buildingComponents={componentWithBasicFieldsUnique}
        categoryNumbersToInclude={categoryNumbersToInclude}
        generateLinkUrlForComponent={generateLinkUrlForComponent}
      />
    </div>
  )
}

export default ProjectCatalog
