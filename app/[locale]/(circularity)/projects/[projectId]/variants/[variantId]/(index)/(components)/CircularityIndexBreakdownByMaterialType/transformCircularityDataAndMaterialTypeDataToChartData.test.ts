// transformCircularityDataAndMaterialTypesToChartData.test.ts

import { MaterialNode, ProcessCategory } from "./CircularityIndexBreakdownByMaterialType"
import { transformCircularityDataAndMaterialTypesToChartData } from "./transformCircularityDataAndMaterialTypeDataToChartData"
import { ChartDataInternalNode, ChartDataLeaf } from "../CircularityIndexBreakdownByDin/ChartAndBreadCrumbComponent"

describe("transformCircularityDataAndMaterialTypesToChartData (with decimal ref_num hierarchy)", () => {
  function createProcessCategory(node_id: number, name: string, ref_num: string | null): ProcessCategory {
    return { node_id, name, ref_num }
  }

  function createMaterialNode(
    component_uuid: string,
    product_id: number,
    name: string,
    process_category_node_id: number,
    weight: number,
    circularityIndex: number
  ): MaterialNode {
    return { component_uuid, product_id, name, process_category_node_id, weight, circularityIndex }
  }

  test("returns empty root with empty inputs", () => {
    const processCategories: ProcessCategory[] = []
    const products: MaterialNode[] = []

    const result = transformCircularityDataAndMaterialTypesToChartData(processCategories, products, "Root", false)

    expect(result.label).toBe("Root")
    expect(result.isLeaf).toBe(false)
    expect((result as ChartDataInternalNode).children).toEqual([])
    expect(result.metricValue).toBe(0)
    expect(result.dimensionalValue).toBe(0)
  })

  test("single category with single product using decimal ref_num", () => {
    // Make Bindemittel a top-level category by using "1" instead of "1.01"
    const processCategories: ProcessCategory[] = [createProcessCategory(614, "Bindemittel", "1")]
    const products: MaterialNode[] = [createMaterialNode("uuid-1", 101, "Cement Product", 614, 100, 0.8)]

    const result = transformCircularityDataAndMaterialTypesToChartData(processCategories, products, "Root", false)

    expect(result.isLeaf).toBe(false)
    const rootChildren = (result as ChartDataInternalNode).children
    expect(rootChildren.length).toBe(1)

    const child = rootChildren[0]
    expect(child).toBeDefined()
    expect(child!.isLeaf).toBe(false)
    expect(child!.label).toBe("Bindemittel")
    expect((child as ChartDataInternalNode).children.length).toBe(1)

    const leaf = (child as ChartDataInternalNode).children[0]
    expect(leaf).toBeDefined()
    expect(leaf!.isLeaf).toBe(true)
    expect((leaf as ChartDataLeaf).label).toBe("Cement Product")
    expect((leaf as ChartDataLeaf).dimensionalValue).toBe(100)
    expect((leaf as ChartDataLeaf).metricValue).toBe(0.8)

    // Check aggregated metrics:
    expect(child!.metricValue).toBe(0.8)
    expect(child!.dimensionalValue).toBe(100)
    expect(result.metricValue).toBe(0.8)
    expect(result.dimensionalValue).toBe(100)
  })

  test("multiple categories with decimal hierarchies", () => {
    // We'll have Mörtel und Beton (1) top-level, Mineralwolle (2) top-level,
    // Metalle (4) top-level, and Stahl und Eisen (4.01) as a subcategory of Metalle(4).
    const processCategories: ProcessCategory[] = [
      createProcessCategory(617, "Mörtel und Beton", "1"),
      createProcessCategory(620, "Mineralwolle", "2"),
      createProcessCategory(608, "Metalle", "4"),
      createProcessCategory(646, "Stahl und Eisen", "4.01"), // child of Metalle (4)
    ]

    const products: MaterialNode[] = [
      createMaterialNode("uuid-1", 101, "Concrete Mix A", 617, 100, 0.8),
      createMaterialNode("uuid-2", 102, "Mineral Wool A", 620, 50, 0.9),
      createMaterialNode("uuid-3", 103, "Steel Beam A", 646, 120, 0.7),
      createMaterialNode("uuid-4", 104, "Steel Beam B", 646, 80, 0.6),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(processCategories, products, "Root", false)
    expect(result.isLeaf).toBe(false)

    const rootChildren = (result as ChartDataInternalNode).children
    // Expect top-level: Mörtel und Beton(1), Mineralwolle(2), Metalle(4)
    const mortarNode = rootChildren.find((c) => c.label === "Mörtel und Beton") as ChartDataInternalNode
    const mineralWoolNode = rootChildren.find((c) => c.label === "Mineralwolle") as ChartDataInternalNode
    const metalsNode = rootChildren.find((c) => c.label === "Metalle") as ChartDataInternalNode

    expect(mortarNode).toBeDefined()
    expect(mineralWoolNode).toBeDefined()
    expect(metalsNode).toBeDefined()

    // Mörtel und Beton:
    expect(mortarNode.children.length).toBe(1)
    const concreteLeaf = mortarNode.children[0] as ChartDataLeaf
    expect(concreteLeaf.label).toBe("Concrete Mix A")
    expect(concreteLeaf.metricValue).toBe(0.8)
    expect(concreteLeaf.dimensionalValue).toBe(100)
    expect(mortarNode.metricValue).toBe(0.8)
    expect(mortarNode.dimensionalValue).toBe(100)

    // Mineralwolle:
    expect(mineralWoolNode.children.length).toBe(1)
    const mineralWoolLeaf = mineralWoolNode.children[0] as ChartDataLeaf
    expect(mineralWoolLeaf.label).toBe("Mineral Wool A")
    expect(mineralWoolLeaf.metricValue).toBe(0.9)
    expect(mineralWoolLeaf.dimensionalValue).toBe(50)
    expect(mineralWoolNode.metricValue).toBe(0.9)
    expect(mineralWoolNode.dimensionalValue).toBe(50)

    // Metalle (4) -> Stahl und Eisen (4.01)
    expect(metalsNode.isLeaf).toBe(false)
    expect(metalsNode.children.length).toBe(1)
    const steelNode = metalsNode.children[0] as ChartDataInternalNode
    expect(steelNode.label).toBe("Stahl und Eisen")
    expect(steelNode.isLeaf).toBe(false)

    const steelBeamA = steelNode.children.find((c) => c.label === "Steel Beam A") as ChartDataLeaf
    const steelBeamB = steelNode.children.find((c) => c.label === "Steel Beam B") as ChartDataLeaf
    expect(steelBeamA.metricValue).toBe(0.7)
    expect(steelBeamA.dimensionalValue).toBe(120)
    expect(steelBeamB.metricValue).toBe(0.6)
    expect(steelBeamB.dimensionalValue).toBe(80)

    // steelNode aggregation:
    // (0.7*120 + 0.6*80) = (84 +48)=132/200=0.66
    expect(steelNode.metricValue).toBeCloseTo(0.66, 2)
    expect(steelNode.dimensionalValue).toBe(200)

    // metalsNode aggregation:
    expect(metalsNode.metricValue).toBeCloseTo(0.66, 2)
    expect(metalsNode.dimensionalValue).toBe(200)

    // Root aggregation:
    // total mass=100+50+200=350
    // weighted avg=(0.8*100 + 0.9*50 +0.66*200)/350
    // = (80 +45 +132)/350=257/350=~0.7343
    expect(result.metricValue).toBeCloseTo(0.7343, 4)
    expect(result.dimensionalValue).toBe(350)
  })

  test("skipRootNode=true with a single top-level category hierarchy", () => {
    // Only one top-level category "Bindemittel" with ref_num "1"
    const processCategories: ProcessCategory[] = [createProcessCategory(614, "Bindemittel", "1")]
    const products: MaterialNode[] = [createMaterialNode("uuid-binder", 501, "Binder Product", 614, 60, 0.95)]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "Artificial Root",
      true
    )
    // Since there's only one top-level category, skipRootNode should flatten to show "Bindemittel" directly.
    expect(result.label).toBe("Bindemittel")
    expect(result.isLeaf).toBe(false)
    expect((result as ChartDataInternalNode).children.length).toBe(1)

    const binderLeaf = (result as ChartDataInternalNode).children[0] as ChartDataLeaf
    expect(binderLeaf.label).toBe("Binder Product")
    expect(binderLeaf.metricValue).toBe(0.95)
    expect(binderLeaf.dimensionalValue).toBe(60)
  })

  test("skipRootNode=true with multiple top-level categories does not flatten", () => {
    // Two top-level categories: Bindemittel(1) and Mörtel und Beton(2)
    const processCategories: ProcessCategory[] = [
      createProcessCategory(614, "Bindemittel", "1"),
      createProcessCategory(617, "Mörtel und Beton", "2"),
    ]
    const products: MaterialNode[] = [
      createMaterialNode("uuid-binder", 501, "Binder Product", 614, 40, 0.8),
      createMaterialNode("uuid-concrete", 502, "Concrete Product", 617, 100, 0.7),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "Artificial Root",
      true
    )
    // Multiple top-level categories mean we keep the artificial root.
    expect(result.label).toBe("Artificial Root")
    expect(result.isLeaf).toBe(false)

    const children = (result as ChartDataInternalNode).children
    expect(children.length).toBe(2)
    expect(children.find((c) => c.label === "Bindemittel")).toBeDefined()
    expect(children.find((c) => c.label === "Mörtel und Beton")).toBeDefined()
  })

  test("handles categories without products", () => {
    // A top-level category "Wärmedämmverbundsystem" (1) with no products
    const processCategories: ProcessCategory[] = [createProcessCategory(640, "Wärmedämmverbundsystem", "1")]
    const products: MaterialNode[] = []

    const result = transformCircularityDataAndMaterialTypesToChartData(processCategories, products, "Root", false)
    // Since the category has no products, it won't appear as a child
    expect((result as ChartDataInternalNode).children.length).toBe(0)
  })

  test("handles nested categories without direct products but with lower-level products", () => {
    // Metalle (4), Stahl und Eisen (4.01), Spezialstahl (4.01.1)
    const processCategories: ProcessCategory[] = [
      createProcessCategory(608, "Metalle", "4"),
      createProcessCategory(646, "Stahl und Eisen", "4.01"),
      createProcessCategory(999, "Spezialstahl", "4.01.1"),
    ]

    const products: MaterialNode[] = [
      createMaterialNode("uuid-specialsteel", 9999, "Special Steel Product", 999, 30, 0.85),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(processCategories, products, "Root", false)

    // Root -> Metalle(4) -> Stahl und Eisen(4.01) -> Spezialstahl(4.01.1) -> Special Steel Product
    const metalleNode = (result as ChartDataInternalNode).children.find(
      (c) => c.label === "Metalle"
    ) as ChartDataInternalNode
    expect(metalleNode).toBeDefined()

    const stahlEisenNode = metalleNode.children.find((c) => c.label === "Stahl und Eisen") as ChartDataInternalNode
    expect(stahlEisenNode).toBeDefined()

    const spezialStahlNode = stahlEisenNode.children.find((c) => c.label === "Spezialstahl") as ChartDataInternalNode
    expect(spezialStahlNode).toBeDefined()

    const specialSteelLeaf = spezialStahlNode.children[0] as ChartDataLeaf
    expect(specialSteelLeaf.label).toBe("Special Steel Product")
    expect(specialSteelLeaf.metricValue).toBe(0.85)
    expect(specialSteelLeaf.dimensionalValue).toBe(30)
  })
})
