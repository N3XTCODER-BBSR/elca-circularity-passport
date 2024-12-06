import { useEffect, useMemo, useState } from "react"
import { BreadCrumbEntry, ChartDatum } from "./CircularityIndexBreakdownByDin"
import { ElcaElementWithComponents } from "lib/domain-logic/types/domain-types"
import {
  ComponentCategory,
  din276Hierarchy,
  costGroupCategoryNumbersToInclude,
} from "lib/domain-logic/grp/data-schema/versions/v1/din276Mapping"
import { CalculateCircularityDataForLayerReturnType } from "lib/domain-logic/circularity/utils/calculate-circularity-data-for-layer"

type UseDinBreakdownDataProps = {
  projectId: number
  projectName: string
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
}

type AggregationResult = {
  chartData: ChartDatum[]
  breadCrumbs: BreadCrumbEntry[]
  totalWeight: number
  currentTitle: string
  isLeafLevel: boolean
}

export function useDinBreakdownData({ projectId, projectName, circularityData }: UseDinBreakdownDataProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(null)
  const [chartData, setChartData] = useState<ChartDatum[]>([])
  const [breadCrumbs, setBreadCrumbs] = useState<BreadCrumbEntry[]>([])
  const [totalWeight, setTotalWeight] = useState(0)

  const filteredDinHierarchy = useMemo(() => getFilteredDinHierarchy(circularityData), [circularityData])

  // Recalculate chart data and breadcrumbs whenever level or selection changes
  useEffect(() => {
    const result = aggregateData({
      projectId,
      projectName,
      circularityData,
      filteredDinHierarchy,
      currentLevel,
      selectedIdentifier,
    })
    setChartData(result.chartData)
    setBreadCrumbs(result.breadCrumbs)
    setTotalWeight(result.totalWeight)
  }, [projectId, projectName, circularityData, filteredDinHierarchy, currentLevel, selectedIdentifier])

  const currentTitle = breadCrumbs[breadCrumbs.length - 1]?.label ?? projectName
  const isLeafLevel = currentLevel === 3

  function handleChartLabelClick(label: string) {
    const clickedItem = chartData.find((item) => item.label === label)
    if (!clickedItem) return
    setSelectedIdentifier(clickedItem.identifier)
    setCurrentLevel(currentLevel + 1)
  }

  function handleBreadCrumbClick(level: number, identifier: string) {
    setCurrentLevel(level)
    setSelectedIdentifier(identifier !== String(projectId) ? identifier : null)
  }

  function getDetailLinkForLeaf(label: string) {
    // On leaf level, we have components. The identifier is an element_uuid
    const clickedItem = chartData.find((item) => item.label === label)
    if (!clickedItem) return undefined
    return `/projects/${projectId}/catalog/components/${clickedItem.identifier}`
  }

  return {
    chartData,
    breadCrumbs,
    totalWeight,
    currentTitle,
    isLeafLevel,
    handleChartLabelClick,
    handleBreadCrumbClick,
    getDetailLinkForLeaf,
  }
}

/** ------------------ Helper Functions ------------------ **/

function getFilteredDinHierarchy(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
): ComponentCategory[] {
  const allComponentCategories = din276Hierarchy.flatMap((group) => group.children)
  const filteredCategories = allComponentCategories.filter((category) =>
    costGroupCategoryNumbersToInclude.includes(category.number)
  )

  return filteredCategories
    .map((category) => ({
      ...category,
      children: category.children.filter((type) =>
        circularityData.some((component) => component.din_code === type.number)
      ),
    }))
    .filter((category) => category.children.length > 0)
}

type AggregateParams = {
  projectId: number
  projectName: string
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[]
  filteredDinHierarchy: ComponentCategory[]
  currentLevel: number
  selectedIdentifier: string | null
}

function aggregateData({
  projectId,
  projectName,
  circularityData,
  filteredDinHierarchy,
  currentLevel,
  selectedIdentifier,
}: AggregateParams): AggregationResult {
  const numericSelectedId = selectedIdentifier ? parseInt(selectedIdentifier) : undefined
  const totalWeight = calculateTotalWeight(circularityData, currentLevel, numericSelectedId)
  let chartData: ChartDatum[] = []
  let breadCrumbs: BreadCrumbEntry[] = []

  if (currentLevel === 1) {
    chartData = aggregateLevelOneData(circularityData, filteredDinHierarchy)
    breadCrumbs = []
  } else if (currentLevel === 2 && numericSelectedId != null) {
    chartData = aggregateLevelTwoData(circularityData, filteredDinHierarchy, numericSelectedId)
    breadCrumbs = [
      { label: projectName, identifier: String(projectId), level: 1 },
      {
        label: getLabelForDinCode(filteredDinHierarchy, numericSelectedId),
        identifier: String(numericSelectedId),
        level: 2,
      },
    ]
  } else if (currentLevel === 3 && numericSelectedId != null) {
    chartData = aggregateLevelThreeData(circularityData, numericSelectedId)
    breadCrumbs = buildLevelThreeBreadCrumbs(projectId, projectName, numericSelectedId, filteredDinHierarchy)
  }

  const currentTitle = breadCrumbs[breadCrumbs.length - 1]?.label ?? projectName
  const isLeafLevel = currentLevel === 3

  return { chartData, breadCrumbs, totalWeight, currentTitle, isLeafLevel }
}

/** Level Aggregation Functions **/

function aggregateLevelOneData(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  filteredDinHierarchy: ComponentCategory[]
): ChartDatum[] {
  return filteredDinHierarchy.map((group) => {
    const avg = calculateAverageCircularityIndex(
      circularityData,
      (comp) => Math.floor(comp.din_code / 10) * 10 === group.number
    )
    const label = `${group.number} ${group.name}`
    return { datum: avg, identifier: String(group.number), label }
  })
}

function aggregateLevelTwoData(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  filteredDinHierarchy: ComponentCategory[],
  parentDinCode: number
): ChartDatum[] {
  const group = filteredDinHierarchy.find((g) => g.number === parentDinCode)
  if (!group) return []

  return group.children.map((child) => {
    const avg = calculateAverageCircularityIndex(circularityData, (comp) => comp.din_code === child.number)
    const label = `${child.number} ${child.name}`
    return { datum: avg, identifier: String(child.number), label }
  })
}

function aggregateLevelThreeData(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  dinCode: number
): ChartDatum[] {
  const components = circularityData.filter((c) => c.din_code === dinCode)
  return components.map((component) => {
    const avg = calculateAverageCircularityIndexForLayers(component.layers)
    const label = component.element_name
    return { datum: avg, identifier: component.element_uuid, label }
  })
}

/** Breadcrumb Building Functions **/

function buildLevelThreeBreadCrumbs(
  projectId: number,
  projectName: string,
  dinCode: number,
  filteredDinHierarchy: ComponentCategory[]
): BreadCrumbEntry[] {
  const level2Din = Math.floor(dinCode / 10) * 10
  const level2Label = getLabelForDinCode(filteredDinHierarchy, level2Din)
  const level3Label = getLabelForDinCode(filteredDinHierarchy, dinCode)

  return [
    { label: projectName, identifier: String(projectId), level: 1 },
    { label: level2Label, identifier: String(level2Din), level: 2 },
    { label: level3Label, identifier: String(dinCode), level: 3 },
  ]
}

function getLabelForDinCode(filteredDinHierarchy: ComponentCategory[], dinCode: number): string {
  if (dinCode % 10 === 0) {
    // level 2 code
    const group = filteredDinHierarchy.find((g) => g.number === dinCode)
    return group ? `${group.number} ${group.name}` : String(dinCode)
  } else {
    // level 3 code
    const child = filteredDinHierarchy.flatMap((g) => g.children).find((c) => c.number === dinCode)
    return child ? `${child.number} ${child.name}` : String(dinCode)
  }
}

/** Calculation Functions **/

function calculateAverageCircularityIndex(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  filterFn: (component: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>) => boolean
): number {
  const selectedComponents = circularityData.filter(filterFn)
  const layers = selectedComponents.flatMap((comp) => comp.layers)
  return calculateAverageCircularityIndexForLayers(layers)
}

function calculateAverageCircularityIndexForLayers(layers: CalculateCircularityDataForLayerReturnType[]): number {
  let totalMass = 0
  let weightedSum = 0

  for (const layer of layers) {
    const mass = layer.quantity
    const ci = layer.circularityIndex ?? 0
    totalMass += mass
    weightedSum += ci * mass
  }

  return totalMass > 0 ? weightedSum / totalMass : 0
}

function calculateTotalWeight(
  circularityData: ElcaElementWithComponents<CalculateCircularityDataForLayerReturnType>[],
  currentLevel: number,
  selectedIdentifier?: number
): number {
  const filtered = circularityData.filter((component) => {
    if (currentLevel === 1) return true
    if (currentLevel === 2 && selectedIdentifier != null)
      return Math.floor(component.din_code / 10) * 10 === selectedIdentifier
    if (currentLevel === 3 && selectedIdentifier != null) return component.din_code === selectedIdentifier
    return false
  })

  let weightSum = 0
  for (const component of filtered) {
    for (const layer of component.layers) {
      if (layer.weight) weightSum += layer.weight
    }
  }

  return weightSum
}
