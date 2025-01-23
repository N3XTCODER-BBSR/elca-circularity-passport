"use client"

import { useTranslations } from "next-intl"
import {
  Area,
  Badge,
  Heading3,
  Required,
  StyledDd,
  StyledDt,
  TwoColGrid,
} from "app/(components)/generic/layout-elements"
import calculateCircularityDataForLayer from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { EnrichedElcaElementComponent } from "lib/domain-logic/types/domain-types"
import { SelectOption } from "lib/domain-logic/types/helper-types"
import CircularityDetails from "./circularity-details/CircularityDetails"
import TBaustoffProductNameOrSelectorButton from "./TBaustoffProductNameOrSelectorButton"

type CircularityInfoProps = {
  projectId: number
  variantId: number
  layerData: EnrichedElcaElementComponent
  tBaustoffProducts: SelectOption[]
}

const CircularityInfo = (props: CircularityInfoProps) => {
  const { tBaustoffProducts } = props
  const t = useTranslations("Circularity.Components.Layers.CircularityInfo")

  // TODO: consider to do this calucation on the server side
  // (or at least be consistent with the other calculation in the conext of the overview page / project circularity index)
  const circulartyEnrichedLayerData = calculateCircularityDataForLayer(props.layerData)

  const showCircularityDetails = !!circulartyEnrichedLayerData.tBaustoffProductData

  return (
    <div className="p-4">
      <div className="flex flex-row">
        <Heading3>{t("title")}</Heading3>
        {!circulartyEnrichedLayerData.circularityIndex && <Badge>{t("incomplete")}</Badge>}
      </div>
      <Area>
        <TwoColGrid>
          <StyledDt>
            {t("tBaustoffMaterial")}
            <Required />
          </StyledDt>
          <StyledDd justifyEnd>
            <TBaustoffProductNameOrSelectorButton layerData={circulartyEnrichedLayerData} options={tBaustoffProducts} />
          </StyledDd>
        </TwoColGrid>
      </Area>

      {showCircularityDetails && (
        <CircularityDetails
          layerData={circulartyEnrichedLayerData}
          variantId={props.variantId}
          projectId={props.projectId}
        />
      )}
    </div>
  )
}

export default CircularityInfo
