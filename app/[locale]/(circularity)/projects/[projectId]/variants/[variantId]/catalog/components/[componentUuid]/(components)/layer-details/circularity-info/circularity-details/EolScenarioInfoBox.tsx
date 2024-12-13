import { StyledDd, StyledDt } from "app/(components)/generic/layout-elements"
import { EOLScenarioMap } from "lib/domain-logic/grp/data-schema/versions/v1/circularityDataUtils"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"

const EolScenarioInfoBox = ({ layerData }: { layerData: EnrichedElcaElementComponent }) => {
  // TODO: use i18n
  // const t = useTranslations("Circularity.Components.Layers.CircularityInfo")

  const isSpecific = layerData.eolUnbuiltSpecificScenario != null

  if (!isSpecific) {
    const eolUnbuiltRealScenarioLabel = layerData.tBaustoffProductData?.eolData?.eolUnbuiltRealScenario
      ? EOLScenarioMap[layerData.tBaustoffProductData.eolData?.eolUnbuiltRealScenario]
      : "-"

    const eolUnbuiltPotentialScenarioLabel = layerData.tBaustoffProductData?.eolData?.eolUnbuiltPotentialScenario
      ? EOLScenarioMap[layerData.tBaustoffProductData.eolData?.eolUnbuiltPotentialScenario]
      : "-"
    return (
      <>
        <div className="mr-4 border px-4 py-2">
          <StyledDt>EOL Scenario (Real)</StyledDt>
          <StyledDd>{eolUnbuiltRealScenarioLabel}</StyledDd>
        </div>
        <div className="mr-4 border px-4 py-2">
          <StyledDt>EOL Scenario (Potenzial)</StyledDt>
          <StyledDd>{eolUnbuiltPotentialScenarioLabel}</StyledDd>
        </div>
      </>
    )
  } else {
    return (
      <div className="mr-4 border px-4 py-2">
        <StyledDt>EOL Scenario (Spezifisch)</StyledDt>
        <StyledDd>
          {layerData.eolUnbuiltSpecificScenario ? EOLScenarioMap[layerData.eolUnbuiltSpecificScenario] : "-"}
        </StyledDd>
      </div>
    )
  }
}

export default EolScenarioInfoBox
