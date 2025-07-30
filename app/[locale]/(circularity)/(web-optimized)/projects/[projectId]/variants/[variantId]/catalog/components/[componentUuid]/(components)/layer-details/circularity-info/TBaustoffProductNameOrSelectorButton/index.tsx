"use client"

import { ErrorText } from "app/(components)/generic/layout-elements"
import { EnrichedElcaElementComponent } from "lib/domain-logic/circularity/misc/domain-types"
import SelectMaterialButton from "./SelectMaterialButton"
import { SelectOption } from "./types"

interface TBaustoffProductNameOrSelectorButtonProps {
  layerData: EnrichedElcaElementComponent
  options: SelectOption[]
}

const TBaustoffProductNameOrSelectorButton: React.FC<TBaustoffProductNameOrSelectorButtonProps> = ({
  layerData,
  options,
}) => {
  if (layerData.tBaustoffProductData == null) {
    return (
      <>
        <ErrorText className="mr-4">Kein Treffer gefunden</ErrorText>
        <SelectMaterialButton options={options} circulartyEnrichedLayerData={layerData} />
      </>
    )
  }

  return (
    <>
      <span
        className="mr-4 mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
        data-testid="tbaustoff-product-name__span"
      >
        {layerData.tBaustoffProductData.name}
      </span>
      <SelectMaterialButton options={options} circulartyEnrichedLayerData={layerData} />
    </>
  )
}

export default TBaustoffProductNameOrSelectorButton
