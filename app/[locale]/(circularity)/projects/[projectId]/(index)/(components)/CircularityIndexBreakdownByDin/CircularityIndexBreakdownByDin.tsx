"use client"

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import {
  din276Hierarchy,
  costGroupCategoryNumbersToInclude,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import React, { useState } from "react"

// Types for DIN hierarchy
type Din276HierarchyItem = {
  number: number
  name: string
  children?: Din276HierarchyItem[]
}

type CircularityIndexBreakdownByDinProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

const CircularityIndexBreakdownByDin = ({ circularityData, margin }: CircularityIndexBreakdownByDinProps) => {
  const [selectedLevel1Din, setSelectedLevel1Din] = useState<number | null>(null)

  // Filter the DIN hierarchy to include only specified level-1 DIN codes
  const filteredDinHierarchy = din276Hierarchy.filter((level1) =>
    costGroupCategoryNumbersToInclude.includes(level1.number)
  )

  // Function to get level-1 DIN code from a layer's DIN code
  const getLevel1DinCode = (dinCode: number): number => {
    return Math.floor(dinCode / 10) * 10
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

  // Function to get level-1 data
  const getLevel1Data = () => {
    return filteredDinHierarchy?.map((level1) => {
      const layers: CalculateCircularityDataForLayerReturnType[] = []
      circularityData.forEach((element) => {
        element.layers.forEach((layer) => {
          const layerLevel1DinCode = getLevel1DinCode(layer.din_code)
          if (layerLevel1DinCode === level1.number) {
            layers.push(layer)
          }
        })
      })
      const averageCircularityIndex = calculateWeightedAverage(layers)
      const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
      return {
        dinCode: level1.number,
        name: level1.name,
        averageCircularityIndex,
        totalMass,
      }
    })
  }

  // Function to get level-2 data for a selected level-1 DIN code
  const getLevel2Data = (level1DinCode: number) => {
    const level1 = filteredDinHierarchy?.find((d) => d.number === level1DinCode)
    if (!level1 || !level1.children) return []

    return level1.children.map((level2) => {
      const layers: CalculateCircularityDataForLayerReturnType[] = []
      circularityData.forEach((element) => {
        element.layers.forEach((layer) => {
          if (layer.din_code === level2.number) {
            layers.push(layer)
          }
        })
      })
      const averageCircularityIndex = calculateWeightedAverage(layers)
      const totalMass = layers.reduce((sum, layer) => sum + getLayerMass(layer), 0)
      return {
        dinCode: level2.number,
        name: level2.name,
        averageCircularityIndex,
        totalMass,
      }
    })
  }

  const level1Data = getLevel1Data()

  return (
    <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
      {selectedLevel1Din === null ? (
        <>
          filteredDinHierarchy: {JSON.stringify(filteredDinHierarchy)}
          <h2>Level-1 DIN Categories</h2>
          <table>
            <thead>
              <tr>
                <th>DIN Code</th>
                <th>Name</th>
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {level1Data?.map((data) => (
                <tr key={data.dinCode} onClick={() => setSelectedLevel1Din(data.dinCode)}>
                  <td>{data.dinCode}</td>
                  <td>{data.name}</td>
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
          <button onClick={() => setSelectedLevel1Din(null)}>Back to Level-1</button>
          <h2>Level-2 DIN Categories for {selectedLevel1Din}</h2>
          <table>
            <thead>
              <tr>
                <th>DIN Code</th>
                <th>Name</th>
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {getLevel2Data(selectedLevel1Din).map((data) => (
                <tr key={data.dinCode}>
                  <td>{data.dinCode}</td>
                  <td>{data.name}</td>
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
