import getEolClassNameByPoints, {
  getEolPointsByScenario,
} from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { TBs_ProductDefinitionEOLCategory } from "prisma/generated/client"

export function calculateEolDataByEolCateogryData(eolCategory: TBs_ProductDefinitionEOLCategory | null | undefined) {
  if (eolCategory == null) {
    return
  }
  const realScenario = eolCategory.eolScenarioUnbuiltReal
  const realPoints = getEolPointsByScenario(realScenario)
  const realClassName = getEolClassNameByPoints(realPoints)

  const potentialScenario = eolCategory.eolScenarioUnbuiltPotential
  const potentialPoints = getEolPointsByScenario(potentialScenario)
  const potentialClassName = getEolClassNameByPoints(potentialPoints)

  const totalPoints = realPoints - (realPoints - potentialPoints) * eolCategory.technologyFactor
  const totalClassName = getEolClassNameByPoints(totalPoints)

  return {
    eolUnbuiltRealScenario: realScenario,
    eolUnbuiltRealPoints: realPoints,
    eolUnbuiltRealClassName: realClassName,
    eolUnbuiltPotentialScenario: potentialScenario,
    eolUnbuiltPotentialPoints: potentialPoints,
    eolUnbuiltPotentialClassName: potentialClassName,
    eolUnbuiltTotalPoints: totalPoints,
    eolUnbuiltTotalClassName: totalClassName,
  }
}
