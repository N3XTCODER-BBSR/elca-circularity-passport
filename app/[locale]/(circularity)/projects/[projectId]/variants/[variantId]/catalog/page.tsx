import errorHandler from "app/(utils)/errorHandler"
import { getElcaElementsForVariantId } from "lib/domain-logic/circularity/misc/getElcaElementsForProjectId"
import { getProjectCircularityIndexData } from "lib/domain-logic/circularity/misc/getProjectCircularityIndex"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import ensureUserIsAuthenticated from "lib/ensureAuthenticated"
import { ensureUserAuthorizationToProject } from "lib/ensureAuthorized"
import ProjectCatalog from "./(components)/ProjectCatalog"

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  return errorHandler(async () => {
    const session = await ensureUserIsAuthenticated()

    const userId = Number(session.user.id)
    const projectId = Number(params.projectId)
    const variantId = Number(params.variantId)

    await ensureUserAuthorizationToProject(userId, projectId)

    const dataResult = await getElcaElementsForVariantId(variantId, projectId)

    if (!dataResult) {
      return <div>Projects with this ID not found for the current user.</div>
    }

    const circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[] =
      await getProjectCircularityIndexData(variantId, projectId)

    const componentUuiddsWithMissingCircularityIndexForAnyProduct: string[] = circularityData
      .filter((component) => component.layers.some((layer) => layer.circularityIndex == null))
      .map((component) => component.element_uuid)

    return (
      <ProjectCatalog
        projectId={projectId}
        variantId={variantId}
        projectComponents={dataResult}
        componentUuiddsWithMissingCircularityIndexForAnyProduct={
          componentUuiddsWithMissingCircularityIndexForAnyProduct
        }
      />
    )
  })
}

export default Page
