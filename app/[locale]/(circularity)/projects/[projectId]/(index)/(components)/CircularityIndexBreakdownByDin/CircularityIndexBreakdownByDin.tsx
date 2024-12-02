"use client"

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  din276Hierarchy,
  costGroupCategoryNumbersToInclude,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import React, { useEffect, useState } from "react"
import CircularityIndexBarChartBreakdown from "./CircularityIndexBarChartBreakdown"
import { set } from "lodash"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

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
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

const CircularityIndexBreakdownByDin = ({
  projectId,
  circularityData,
  margin,
}: CircularityIndexBreakdownByDinProps) => {
  // const [selectedLevel1Din, setSelectedLevel1Din] = useState<number | null>(null)

  // Flatten the hierarchy to get all ComponentCategories (level-1)
  const allComponentCategories: ComponentCategory[] = din276Hierarchy.flatMap((group) => group.children)

  // Filter the DIN hierarchy to include only specified level-1 DIN codes (ComponentCategories)
  const filteredDinHierarchy = allComponentCategories.filter((category) =>
    costGroupCategoryNumbersToInclude.includes(category.number)
  )

  // Function to get level-1 DIN code from a layer's DIN code
  const getLevel1DinCode = (dinCode: number): number => {
    return Math.floor(dinCode / 10) * 10 // e.g., 332 -> 330
  }

  // // Function to calculate mass (assuming 'quantity' represents mass in kg)
  // const getLayerMass = (layer: CalculateCircularityDataForLayerReturnType): number => {
  //   return layer.quantity
  // }

  // Function to calculate weighted average circularity index
  // const calculateWeightedAverage = (layers: CalculateCircularityDataForLayerReturnType[]) => {
  //   let totalMass = 0
  //   let weightedSum = 0

  //   layers.forEach((layer) => {
  //     const mass = getLayerMass(layer)
  //     const circularityIndex = layer.circularityIndex || 0

  //     totalMass += mass
  //     weightedSum += circularityIndex * mass
  //   })

  //   return totalMass > 0 ? weightedSum / totalMass : undefined
  // }

  // // Function to get level-1 data (ComponentCategories)
  // const getLevel1Data = () => {
  //   return filteredDinHierarchy.map((category) => {
  //     const layers: CalculateCircularityDataForLayerReturnType[] = []
  //     const elementsSet = new Set<string>() // To store unique component IDs

  //     circularityData.forEach((element) => {
  //       let elementHasLayerInLevel1 = false

  //       element.layers.forEach((layer) => {
  //         const layerLevel1DinCode = getLevel1DinCode(layer.din_code)
  //         if (layerLevel1DinCode === category.number) {
  //           layers.push(layer)
  //           elementHasLayerInLevel1 = true
  //         }
  //       })

  //       if (elementHasLayerInLevel1) {
  //         elementsSet.add(element.element_uuid)
  //       }
  //     })

  //     const averageCircularityIndex = calculateWeightedAverage(layers)
  //     const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
  //     const componentCount = elementsSet.size

  //     return {
  //       dinCode: category.number,
  //       name: category.name,
  //       averageCircularityIndex,
  //       totalMass,
  //       componentCount,
  //       children: category.children,
  //     }
  //   })
  // }

  // // Function to get level-2 data (ComponentTypes) for a selected level-1 DIN code
  // const getLevel2Data = (level1DinCode: number) => {
  //   const level1 = filteredDinHierarchy.find((d) => d.number === level1DinCode)
  //   if (!level1 || !level1.children) return []

  //   return level1.children.map((level2) => {
  //     const layers: CalculateCircularityDataForLayerReturnType[] = []
  //     const elementsSet = new Set<string>() // To store unique component IDs

  //     circularityData.forEach((element) => {
  //       let elementHasLayerInLevel2 = false

  //       element.layers.forEach((layer) => {
  //         if (layer.din_code === level2.number) {
  //           layers.push(layer)
  //           elementHasLayerInLevel2 = true
  //         }
  //       })

  //       if (elementHasLayerInLevel2) {
  //         elementsSet.add(element.element_uuid)
  //       }
  //     })

  //     const averageCircularityIndex = calculateWeightedAverage(layers)
  //     const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
  //     const componentCount = elementsSet.size

  //     return {
  //       dinCode: level2.number,
  //       name: level2.name,
  //       averageCircularityIndex,
  //       totalMass,
  //       componentCount,
  //     }
  //   })
  // }

  // TODO: general todo: ensure to handle correctly (e.g. by filtering out?) elements with missing DIN codes

  type Data = {
    identifier: string
    datum: number
    label: string
  }
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(null)
  const [labelToIdentifierAndDataMap, setLabelToIdentifierAndDataMap] = useState<Map<string, Data>>(new Map())

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

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
        // router.push(`${newPath}${queryParams ? `?${queryParams}` : ""}`)
        router.push(generateLinkUrlForComponent(identifierAndDatum.identifier))
      }
      console.log("identifierAndDatum", identifierAndDatum)
      setSelectedIdentifier(identifierAndDatum.identifier)
      setCurrentLevel(currentLevel + 1)
    }

    // TODO: move this into an effect
    // calculate next level data
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
        // return dinLevel2.children.flatMap((dinLevel3) => {
        // console.log("componentType.number", componentType.number)
        const componentsForCurrentDinLeve = circularityData.filter((component) => {
          // console.log("element.din_code", element.din_code)
          const normalizedDinCodeOfComponent = Math.floor(component.din_code / 10) * 10
          console.log("FOO component.din_code", component.din_code)
          console.log("FOO normalizedDinCodeOfComponent", normalizedDinCodeOfComponent)
          console.log("FOO dinLevel3.number", dinLevel2.number)
          console.log("--------------------")
          return normalizedDinCodeOfComponent === dinLevel2.number
        })

        const productsForCurrentDinLevel = componentsForCurrentDinLeve.flatMap((component) => component.layers)

        const averageCircularityIndex = calculateWeightedAverage(productsForCurrentDinLevel)

        return {
          identifier: `${dinLevel2.number}`,
          datum: averageCircularityIndex !== undefined ? averageCircularityIndex : 0,
          label: `${dinLevel2.number} ${dinLevel2.name}`,
        }
      })

      setLabelToIdentifierAndDataMap(new Map(FOO.map((data) => [`${data.label}`, data])))
    } else if (currentLevel === 2) {
      // Iterate through all level-2 DIN codes for currently selected level-1 DIN code and
      // get a flattened list of products that are somewhere nested under each respective level-2 DIN code

      const selectedGroup = filteredDinHierarchy.find(
        (dinLevel2) => selectedIdentifier != null && dinLevel2.number === parseInt(selectedIdentifier)
      )
      // console.log("FOO filteredDinHierarchy", filteredDinHierarchy)

      if (!selectedGroup) {
        setLabelToIdentifierAndDataMap(new Map())
        return
      }

      // alert(FOO?.number)

      const FOO = selectedGroup?.children.flatMap((dinLevel3) => {
        // console.log("componentType.number", componentType.number)
        const componentsForCurrentDinLevel = circularityData.filter((component) => {
          // console.log("element.din_code", element.din_code)
          // const normalizedDinCodeOfComponent = Math.floor(component.din_code / 10) * 10
          // console.log("FOO component.din_code", component.din_code)
          // console.log("FOO normalizedDinCodeOfComponent", normalizedDinCodeOfComponent)
          // console.log("FOO dinLevel3.number", dinLevel2.number)
          // console.log("--------------------")
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
    } else if (currentLevel === 3) {
      const selectedComponents = circularityData
        .filter((component) => {
          return selectedIdentifier != null && component.din_code === parseInt(selectedIdentifier)
        })
        .map((component) => {
          const averageCircularityIndex = calculateWeightedAverage(component.layers)
          return {
            identifier: `${component.din_code}`,
            datum: averageCircularityIndex !== undefined ? averageCircularityIndex : 0,
            label: `${component.din_code}`,
          }
        })

      setLabelToIdentifierAndDataMap(new Map(selectedComponents.map((data) => [`${data.label}`, data])))

      console.log("FOO selectedComponents", selectedComponents)
      // console.log("FOO filteredDinHierarchy", filteredDinHierarchy)
    } else {
      setLabelToIdentifierAndDataMap(new Map())
    }
  }, [currentLevel])

  // set chartData to labelToIdentifierAndDataMap
  const chartData: { datum: number; identifier: string }[] = Array.from(labelToIdentifierAndDataMap.values()).map(
    (data) => ({
      identifier: data.label,
      datum: data.datum,
    })
  )
  // const level1Data = getLevel1Data()

  // const labelToIdentifiedAndLevelMap: Map<string, { label: string; level: number }> = new Map(
  //   level1Data.map((data) => [`${data.dinCode}`, { label: `${data.dinCode} ${data.name}`, level: 1 }])
  // )

  // useEffect(() => {
  //   if(currentLevel === 1) {
  //     const newMap = new Map(
  //       level1Data.map((data) => [`${data.dinCode}`, `${data.dinCode} ${data.name}`])
  //     )
  //     setLabelToIdentifierMap(newMap)
  //   }
  //   console.log("currentLevel", currentLevel)

  // }, [currentLevel])

  // const labelToIdentifierMap: Map<string, string> = new Map(
  //   level1Data.map((data) => [`${data.dinCode}`, `${data.dinCode} ${data.name}`, level: 1 }])
  // )

  // const level1DataForChart = level1Data.map((data) => ({
  //   identifier: `${data.dinCode} ${data.name}`,
  //   datum: data.averageCircularityIndex !== undefined ? data.averageCircularityIndex : 0,
  // }))

  return (
    <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
      currentLevel: {currentLevel}
      <br />
      selectedIdentifier: {selectedIdentifier}
      <br />
      <div className="m-8 h-[200px]">
        <CircularityIndexBarChartBreakdown data={chartData} margin={margin} clickHandler={chartLabelClickHandler} />
      </div>
    </div>
  )
}

export default CircularityIndexBreakdownByDin

// selectedLevel1Din: {selectedLevel1Din}
//       <br />
//       {selectedLevel1Din === null ? (
//         <>
//           {/* FOO: {FOO}
//           <br />
//           <br />
//           <br />
//           level1Data: {JSON.stringify(level1Data)}
//           <br />
//           <br />
//           <br />
//           level1DataForChart: {JSON.stringify(level1DataForChart)} */}
//           <div className="m-8 h-[200px]">
//             <CircularityIndexBarChartBreakdown
//               data={level1DataForChart}
//               margin={margin}
//               clickHandler={chartLabelClickHandler}
//             />
//           </div>
//           <h2>DIN Categories</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>DIN Code</th>
//                 <th>Name</th>
//                 <th>Components</th>
//                 <th>Average Circularity Index</th>
//                 <th>Total Mass (kg)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {level1Data.map((data) => (
//                 <tr key={data.dinCode} onClick={() => setSelectedLevel1Din(data.dinCode)}>
//                   <td>{data.dinCode}</td>
//                   <td>{data.name}</td>
//                   <td>{data.componentCount}</td>
//                   <td>
//                     {data.averageCircularityIndex !== undefined ? data.averageCircularityIndex.toFixed(2) : "N/A"}
//                   </td>
//                   <td>{data.totalMass.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       ) : (
//         <>
//           <button onClick={() => setSelectedLevel1Din(null)}>Back</button>
//           <h2>Subcategories for {selectedLevel1Din}</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>DIN Code</th>
//                 <th>Name</th>
//                 <th>Components</th>
//                 <th>Average Circularity Index</th>
//                 <th>Total Mass (kg)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {getLevel2Data(selectedLevel1Din).map((data) => (
//                 <tr key={data.dinCode}>
//                   <td>{data.dinCode}</td>
//                   <td>{data.name}</td>
//                   <td>{data.componentCount}</td>
//                   <td>
//                     {data.averageCircularityIndex !== undefined ? data.averageCircularityIndex.toFixed(2) : "N/A"}
//                   </td>
//                   <td>{data.totalMass.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
