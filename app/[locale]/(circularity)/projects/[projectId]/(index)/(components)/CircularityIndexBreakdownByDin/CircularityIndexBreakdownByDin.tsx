"use client"

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  din276Hierarchy,
  costGroupCategoryNumbersToInclude,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import React, { useState } from "react"

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
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

const CircularityIndexBreakdownByDin = ({ circularityData, margin }: CircularityIndexBreakdownByDinProps) => {
  const [selectedLevel1Din, setSelectedLevel1Din] = useState<number | null>(null)

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

  // Function to calculate mass (assuming 'quantity' represents mass in kg)
  const getLayerMass = (layer: CalculateCircularityDataForLayerReturnType): number => {
    return layer.quantity
  }

  // Function to calculate weighted average circularity index
  const calculateWeightedAverage = (layers: CalculateCircularityDataForLayerReturnType[]) => {
    let totalMass = 0
    let weightedSum = 0

    layers.forEach((layer) => {
      const mass = getLayerMass(layer)
      const circularityIndex = layer.circularityIndex || 0

      totalMass += mass
      weightedSum += circularityIndex * mass
    })

    return totalMass > 0 ? weightedSum / totalMass : undefined
  }

  // Function to get level-1 data (ComponentCategories)
  const getLevel1Data = () => {
    return filteredDinHierarchy.map((category) => {
      const layers: CalculateCircularityDataForLayerReturnType[] = []
      const elementsSet = new Set<string>() // To store unique component IDs

      circularityData.forEach((element) => {
        let elementHasLayerInLevel1 = false

        element.layers.forEach((layer) => {
          const layerLevel1DinCode = getLevel1DinCode(layer.din_code)
          if (layerLevel1DinCode === category.number) {
            layers.push(layer)
            elementHasLayerInLevel1 = true
          }
        })

        if (elementHasLayerInLevel1) {
          elementsSet.add(element.element_uuid)
        }
      })

      const averageCircularityIndex = calculateWeightedAverage(layers)
      const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
      const componentCount = elementsSet.size

      return {
        dinCode: category.number,
        name: category.name,
        averageCircularityIndex,
        totalMass,
        componentCount,
        children: category.children,
      }
    })
  }

  // Function to get level-2 data (ComponentTypes) for a selected level-1 DIN code
  const getLevel2Data = (level1DinCode: number) => {
    const level1 = filteredDinHierarchy.find((d) => d.number === level1DinCode)
    if (!level1 || !level1.children) return []

    return level1.children.map((level2) => {
      const layers: CalculateCircularityDataForLayerReturnType[] = []
      const elementsSet = new Set<string>() // To store unique component IDs

      circularityData.forEach((element) => {
        let elementHasLayerInLevel2 = false

        element.layers.forEach((layer) => {
          if (layer.din_code === level2.number) {
            layers.push(layer)
            elementHasLayerInLevel2 = true
          }
        })

        if (elementHasLayerInLevel2) {
          elementsSet.add(element.element_uuid)
        }
      })

      const averageCircularityIndex = calculateWeightedAverage(layers)
      const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
      const componentCount = elementsSet.size

      return {
        dinCode: level2.number,
        name: level2.name,
        averageCircularityIndex,
        totalMass,
        componentCount,
      }
    })
  }

  const level1Data = getLevel1Data()

  return (
    <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
      {selectedLevel1Din === null ? (
        <>
          <h2>DIN Categories</h2>
          <table>
            <thead>
              <tr>
                <th>DIN Code</th>
                <th>Name</th>
                <th>Components</th>
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {level1Data.map((data) => (
                <tr key={data.dinCode} onClick={() => setSelectedLevel1Din(data.dinCode)}>
                  <td>{data.dinCode}</td>
                  <td>{data.name}</td>
                  <td>{data.componentCount}</td>
                  <td>
                    {data.averageCircularityIndex !== undefined ? data.averageCircularityIndex.toFixed(2) : "N/A"}
                  </td>
                  <td>{data.totalMass.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedLevel1Din(null)}>Back</button>
          <h2>Subcategories for {selectedLevel1Din}</h2>
          <table>
            <thead>
              <tr>
                <th>DIN Code</th>
                <th>Name</th>
                <th>Components</th>
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {getLevel2Data(selectedLevel1Din).map((data) => (
                <tr key={data.dinCode}>
                  <td>{data.dinCode}</td>
                  <td>{data.name}</td>
                  <td>{data.componentCount}</td>
                  <td>
                    {data.averageCircularityIndex !== undefined ? data.averageCircularityIndex.toFixed(2) : "N/A"}
                  </td>
                  <td>{data.totalMass.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

export default CircularityIndexBreakdownByDin
