"use client"
import ComponentsTree from "app/(components)/ComponentsTree"
import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

type ProjectCatalogProps = {
  passportId: string
  projectComponents: DinEnrichedBuildingComponent[]
}

const ProjectCatalog = ({ passportId, projectComponents }: ProjectCatalogProps) => {
  const generateLinkUrlForComponent = (uuid: string): string => `/grp/${passportId}/catalog/components/${uuid}`

  return (
    <div>
      <ComponentsTree components={projectComponents} generateLinkUrlForComponent={generateLinkUrlForComponent} />
    </div>
  )
}

export default ProjectCatalog
