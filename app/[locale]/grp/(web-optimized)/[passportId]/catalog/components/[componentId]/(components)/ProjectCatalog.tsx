"use client"
import ComponentsTree from "app/[locale]/grp/(web-optimized)/[passportId]/catalog/(components)/ComponentsTree"
import { DinEnrichedBuildingComponent } from "domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"

type ProjectCatalogProps = {
  passportId: string
  projectComponents: DinEnrichedBuildingComponent[]
}

const ProjectCatalog = ({ passportId, projectComponents }: ProjectCatalogProps) => {
  const generateLinkUrlForComponent = (uuid: string): string => `/grp/${passportId}/catalog/components/${uuid}`

  return (
    <div>
      <ComponentsTree
        buildingComponents={projectComponents}
        generateLinkUrlForComponent={generateLinkUrlForComponent}
      />
    </div>
  )
}

export default ProjectCatalog
