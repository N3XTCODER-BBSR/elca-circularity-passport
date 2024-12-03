"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  costGroupCategoryNumbersToInclude,
  din276Hierarchy,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import CircularityIndexBarChartBreakdown from "./CircularityIndexBarChartBreakdown"

// Types for DIN hierarchy
type ComponentType = {
  number: number
  name: string
}

type ComponentCategory = {
  number: number
  name: string
  children: ComponentType[]
}

type CircularityIndexBreakdownByDinProps = {
  projectId: number
  projectName: string
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

// Flatten the hierarchy to get all ComponentCategories (level-1)
const allComponentCategories: ComponentCategory[] = din276Hierarchy.flatMap((group) => group.children)

// Filter the DIN hierarchy to include only specified level-1 DIN codes (ComponentCategories)
const filteredDinHierarchy = allComponentCategories.filter((category) =>
  costGroupCategoryNumbersToInclude.includes(category.number)
)

const getDinGroupByDinCode = (dinCode: number) => {
  // determine code level
  // if the code last two digits are 0, it's level 1
  // if only the last digit is 0, it's level 2
  // otherwise it's level 3
  const dinCodeLevel = dinCode % 10 === 0 ? (dinCode % 100 === 0 ? 1 : 2) : 3

  if (dinCodeLevel === 2) {
    return filteredDinHierarchy.find((el) => el.number === dinCode)
  } else if (dinCodeLevel === 3) {
    return filteredDinHierarchy.flatMap((el) => el.children).find((dinLevel2) => dinLevel2.number === dinCode)
  }
}

const CircularityIndexBreakdownByDin = ({
  projectId,
  projectName,
  circularityData,
  margin,
}: CircularityIndexBreakdownByDinProps) => {
  // TODO: general todo: ensure to handle correctly (e.g. by filtering out?) elements with missing DIN codes

  type Data = {
    identifier: string
    datum: number
    label: string
  }
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(null)
  const [labelToIdentifierAndDataMap, setLabelToIdentifierAndDataMap] = useState<Map<string, Data>>(new Map())

  type BreadCrumbEntry = {
    label: string
    identifier: string
    level: number
  }
  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumbEntry[]>([])

  const router = useRouter()

  // Use selects a value from the navigation (any level)
  // labelToIdentifierMap is used to get the data for the next level
  // => state update
  //   => selected identifier
  //   => current level
  // useEffect is used to update the labelToIdentifierMap based on the current level and the selected identifier

  const chartLabelClickHandler = (label: string) => {
    console.log("FOOclickHandler", label)
    const identifierAndDatum = labelToIdentifierAndDataMap.get(label)
    if (identifierAndDatum) {
      if (currentLevel === 3) {
        // go to detail page of selected component
        const generateLinkUrlForComponent = (uuid: string): string =>
          `/projects/${projectId}/catalog/components/${uuid}`
        router.push(generateLinkUrlForComponent(identifierAndDatum.identifier))
      } else {
        console.log("identifierAndDatum", identifierAndDatum)
        setSelectedIdentifier(identifierAndDatum.identifier)
        setCurrentLevel(currentLevel + 1)
      }
    }
  }

  const calculateWeightedAverage = (productsForCurrentDinLevel: CalculateCircularityDataForLayerReturnType[]) => {
    let totalMass = 0
    let weightedSum = 0

    productsForCurrentDinLevel.forEach((product) => {
      const mass = product.quantity

      // TODO: the following check should not be necessary anymore once the data is cleaned up
      // we might want to have a more specific type which does not allow undefined values here
      const circularityIndex = product.circularityIndex || 0

      totalMass += mass
      weightedSum += circularityIndex * mass
    })

    return totalMass > 0 ? weightedSum / totalMass : undefined
  }

  useEffect(() => {
    if (currentLevel === 1) {
      // Iterate through all level-1 DIN codes and
      // get a flattened list of products that are somewhere nested under each respective level-1 DIN code

      const FOO = filteredDinHierarchy.flatMap((dinLevel2) => {
        const componentsForCurrentDinLeve = circularityData.filter((component) => {
          const normalizedDinCodeOfComponent = Math.floor(component.din_code / 10) * 10
          return normalizedDinCodeOfComponent === dinLevel2.number
        })

        const productsForCurrentDinLevel = componentsForCurrentDinLeve.flatMap((component) => component.layers)

        const averageCircularityIndex = calculateWeightedAverage(productsForCurrentDinLevel)

        const label = `${dinLevel2.number} ${dinLevel2.name}`
        const identifier = `${dinLevel2.number}`

        return {
          identifier,
          label,
          datum: averageCircularityIndex !== undefined ? averageCircularityIndex : 0,
        }
      })

      setBreadCrumbs([])

      setLabelToIdentifierAndDataMap(new Map(FOO.map((data) => [`${data.label}`, data])))
    } else if (currentLevel === 2) {
      // Iterate through all level-2 DIN codes for currently selected level-1 DIN code and
      // get a flattened list of products that are somewhere nested under each respective level-2 DIN code

      const selectedGroup = filteredDinHierarchy.find(
        (dinLevel2) => selectedIdentifier != null && dinLevel2.number === parseInt(selectedIdentifier)
      )

      if (!selectedGroup) {
        setLabelToIdentifierAndDataMap(new Map())
        return
      }

      const FOO = selectedGroup?.children.flatMap((dinLevel3) => {
        const componentsForCurrentDinLevel = circularityData.filter((component) => {
          return component.din_code === dinLevel3.number
        })

        const productsForCurrentDinLevel = componentsForCurrentDinLevel.flatMap((component) => component.layers)

        const averageCircularityIndex = calculateWeightedAverage(productsForCurrentDinLevel)

        return {
          identifier: `${dinLevel3.number}`,
          datum: averageCircularityIndex !== undefined ? averageCircularityIndex : 0,
          label: `${dinLevel3.number} ${dinLevel3.name}`,
        }
      })

      setLabelToIdentifierAndDataMap(new Map(FOO.map((data) => [`${data.label}`, data])))

      const selectedGroupLabel = `${selectedGroup.number} ${selectedGroup.name}`
      setBreadCrumbs([
        {
          label: projectName,
          identifier: String(projectId),
          level: 1,
        },
        {
          label: selectedGroupLabel,
          identifier: String(selectedGroup.number),
          level: 2,
        },
      ])
    } else if (currentLevel === 3) {
      if (selectedIdentifier === null) {
        // TODO: error logging
        return
      }
      const selectedComponents = circularityData
        .filter((component) => {
          return selectedIdentifier != null && component.din_code === parseInt(selectedIdentifier)
        })
        .map((component) => {
          const averageCircularityIndex = calculateWeightedAverage(component.layers)
          return {
            identifier: `${component.element_uuid}`,
            datum: averageCircularityIndex !== undefined ? averageCircularityIndex : 0,
            label: `${component.element_name}`,
          }
        })

      setLabelToIdentifierAndDataMap(new Map(selectedComponents.map((data) => [`${data.label}`, data])))

      const selectedIdentiferAsNumber = parseInt(selectedIdentifier)
      const dinGroupForSelectedDinCodeForLevel3 = getDinGroupByDinCode(selectedIdentiferAsNumber)
      const dinGroupForSelectedDinCodeForLevel2 = getDinGroupByDinCode(Math.floor(selectedIdentiferAsNumber / 10) * 10)

      setBreadCrumbs([
        // ...breadCrumbs,
        {
          label: projectName,
          identifier: String(projectId),
          level: 1,
        },
        {
          // label: selectedGroup!.name,
          label: `${dinGroupForSelectedDinCodeForLevel2?.number} ${dinGroupForSelectedDinCodeForLevel2?.name}`,
          identifier: String(dinGroupForSelectedDinCodeForLevel2?.number),
          level: 2,
        },
        {
          // label: selectedGroup!.name,
          label: `${dinGroupForSelectedDinCodeForLevel3?.number} ${dinGroupForSelectedDinCodeForLevel3?.name}`,
          identifier: String(dinGroupForSelectedDinCodeForLevel3?.number),
          level: 3,
        },
      ])

      console.log("FOO selectedComponents", selectedComponents)
      // console.log("FOO filteredDinHierarchy", filteredDinHierarchy)
    } else {
      setLabelToIdentifierAndDataMap(new Map())
    }
  }, [circularityData, currentLevel, projectId, projectName, selectedIdentifier])

  // set chartData to labelToIdentifierAndDataMap
  const chartData: { datum: number; identifier: string }[] = Array.from(labelToIdentifierAndDataMap.values()).map(
    (data) => ({
      identifier: data.label,
      datum: data.datum,
    })
  )

  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex DIN 276</h2>
        <div className="mt-4 px-8 py-4">{breadCrumbs[breadCrumbs.length - 1]?.label}</div>
      </div>

      <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
        {breadCrumbs.map((entry, idx) => (
          <React.Fragment key={entry.identifier}>
            {idx === breadCrumbs.length - 1 ? (
              <>
                {" "}
                <span key={entry.label} className="text-gray500 text-sm">
                  {entry.label}
                </span>
              </>
            ) : (
              <>
                <button
                  key={entry.label}
                  className="text-gray500 text-sm"
                  onClick={() => {
                    setSelectedIdentifier(entry.identifier)
                    setCurrentLevel(entry.level)
                  }}
                >
                  {entry.label}
                </button>
                {" > "}
              </>
            )}
          </React.Fragment>
        ))}
        {/* currentLevel: {currentLevel}
      <br />
      selectedIdentifier: {selectedIdentifier}
      <br /> */}
        <div className="mx-8 mb-64 h-[200px]">
          <CircularityIndexBarChartBreakdown data={chartData} margin={margin} clickHandler={chartLabelClickHandler} />
        </div>
      </div>
    </>
  )
}

export default CircularityIndexBreakdownByDin
