"use client"

import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import React, { useState } from "react"

type CircularityIndexBreakdownByDinProps = {
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  margin: { top: number; right: number; bottom: number; left: number }
}

const CircularityIndexBreakdownByDin = ({ circularityData, margin }: CircularityIndexBreakdownByDinProps) => {
  const [selectedLevel1Din, setSelectedLevel1Din] = useState<number | null>(null)

  // Helper functions to extract level-1 and level-2 DIN codes
  const getLevel1DinCode = (dinCode: number): number => {
    return Math.floor(dinCode / 10) // Assuming DIN codes are in the format XYZ, where X is level-1
  }

  const getLevel2DinCode = (dinCode: number): number => {
    return dinCode // Assuming full DIN code is level-2
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

    return totalMass > 0 ? weightedSum / totalMass : 0
  }

  // Group data by level-1 DIN codes
  const getLevel1Data = () => {
    const level1Groups: { [key: number]: CalculateCircularityDataForLayerReturnType[] } = {}

    circularityData.forEach((element) => {
      element.layers.forEach((layer) => {
        const level1Din = getLevel1DinCode(layer.din_code)
        if (!level1Groups[level1Din]) {
          level1Groups[level1Din] = []
        }
        level1Groups[level1Din].push(layer)
      })
    })

    return Object.keys(level1Groups).map((dinCode) => {
      const layers = level1Groups[parseInt(dinCode)]!
      return {
        dinCode: parseInt(dinCode),
        averageCircularityIndex: calculateWeightedAverage(layers),
        totalMass: layers.reduce((sum, layer) => sum + getLayerMass(layer), 0),
      }
    })
  }

  // Group data by level-2 DIN codes for a selected level-1 DIN code
  const getLevel2Data = (level1DinCode: number) => {
    const level2Groups: { [key: number]: CalculateCircularityDataForLayerReturnType[] } = {}

    circularityData.forEach((element) => {
      element.layers.forEach((layer) => {
        if (getLevel1DinCode(layer.din_code) === level1DinCode) {
          const level2Din = getLevel2DinCode(layer.din_code)
          if (!level2Groups[level2Din]) {
            level2Groups[level2Din] = []
          }
          level2Groups[level2Din].push(layer)
        }
      })
    })

    return Object.keys(level2Groups).map((dinCode) => {
      const layers = level2Groups[parseInt(dinCode)]!
      return {
        dinCode: parseInt(dinCode),
        averageCircularityIndex: calculateWeightedAverage(layers),
        totalMass: layers.reduce((sum, layer) => sum + getLayerMass(layer), 0),
      }
    })
  }

  const level1Data = getLevel1Data()

  return (
    <div style={{ margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px` }}>
      {selectedLevel1Din === null ? (
        <>
          <h2>Level-1 DIN Categories</h2>
          <table>
            <thead>
              <tr>
                <th>DIN Code</th>
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {level1Data.map((data) => (
                <tr key={data.dinCode} onClick={() => setSelectedLevel1Din(data.dinCode)}>
                  <td>{data.dinCode}</td>
                  <td>{data.averageCircularityIndex.toFixed(2)}</td>
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
                <th>Average Circularity Index</th>
                <th>Total Mass (kg)</th>
              </tr>
            </thead>
            <tbody>
              {getLevel2Data(selectedLevel1Din).map((data) => (
                <tr key={data.dinCode}>
                  <td>{data.dinCode}</td>
                  <td>{data.averageCircularityIndex.toFixed(2)}</td>
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
