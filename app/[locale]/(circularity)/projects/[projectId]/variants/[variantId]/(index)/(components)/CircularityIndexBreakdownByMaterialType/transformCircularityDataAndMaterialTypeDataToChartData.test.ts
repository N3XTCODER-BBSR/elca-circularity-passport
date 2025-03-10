/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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
    component_name: string,
    product_id: number,
    name: string,
    process_category_node_id: number,
    volume: number,
    mass: number,
    circularityIndex: number
  ): MaterialNode {
    return {
      component_uuid,
      component_name,
      product_id,
      name,
      process_category_node_id,
      volume,
      mass,
      circularityIndex,
    }
  }

  test("returns empty root with empty inputs", () => {
    const processCategories: ProcessCategory[] = []
    const products: MaterialNode[] = []

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Root",
      false
    )

    expect(result.label).toBe("Root")
    expect(result.isLeaf).toBe(false)
    expect((result as ChartDataInternalNode).children).toEqual([])
    expect(result.metricValue).toBe(0)
    expect(result.dimensionalValue).toBe(0)
  })

  test("single category with single product using decimal ref_num", () => {
    // Make Bindemittel a top-level category by using "1"
    const processCategories: ProcessCategory[] = [createProcessCategory(614, "Bindemittel", "1")]
    const products: MaterialNode[] = [createMaterialNode("uuid-1", "Comp: 1", 101, "Cement Product", 614, 50, 100, 0.8)]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Root",
      false
    )

    // Root node checks
    expect(result.label).toBe("Root")
    expect(result.isLeaf).toBe(false)
    const rootChildren = (result as ChartDataInternalNode).children
    expect(rootChildren.length).toBe(1)

    // Category node: "Bindemittel"
    const categoryNode = rootChildren[0] as ChartDataInternalNode
    expect(categoryNode).toBeDefined()
    expect(categoryNode.isLeaf).toBe(false)
    expect(categoryNode.label).toBe("Bindemittel")
    expect(categoryNode.children.length).toBe(1)

    // Product-group node: labeled "Cement Product"
    const productGroupNode = categoryNode.children[0] as ChartDataInternalNode
    expect(productGroupNode.isLeaf).toBe(false)
    expect(productGroupNode.label).toBe("Cement Product")
    expect(productGroupNode.children.length).toBe(1)

    // Actual leaf node: labeled by component_name = "Comp: 1"
    const leaf = productGroupNode.children[0] as ChartDataLeaf
    expect(leaf.isLeaf).toBe(true)
    expect(leaf.label).toBe("Comp: 1")
    expect(leaf.dimensionalValue).toBe(100)
    expect(leaf.metricValue).toBe(0.8)

    // Check aggregated metrics up the hierarchy:
    expect(productGroupNode.metricValue).toBe(0.8)
    expect(productGroupNode.dimensionalValue).toBe(100)

    expect(categoryNode.metricValue).toBe(0.8)
    expect(categoryNode.dimensionalValue).toBe(100)

    expect(result.metricValue).toBe(0.8)
    expect(result.dimensionalValue).toBe(100)
  })

  test("multiple categories with decimal hierarchies", () => {
    // We'll have Mörtel und Beton(1), Mineralwolle(2), Metalle(4), Stahl und Eisen(4.01)
    const processCategories: ProcessCategory[] = [
      createProcessCategory(617, "Mörtel und Beton", "1"),
      createProcessCategory(620, "Mineralwolle", "2"),
      createProcessCategory(608, "Metalle", "4"),
      createProcessCategory(646, "Stahl und Eisen", "4.01"), // child of Metalle(4)
    ]

    const products: MaterialNode[] = [
      createMaterialNode("uuid-1", "Comp: 1", 101, "Concrete Mix A", 617, 50, 100, 0.8),
      createMaterialNode("uuid-2", "Comp: 2", 102, "Mineral Wool A", 620, 25, 50, 0.9),
      createMaterialNode("uuid-3", "Comp: 3", 103, "Steel Beam A", 646, 60, 120, 0.7),
      createMaterialNode("uuid-4", "Comp: 4", 104, "Steel Beam B", 646, 40, 80, 0.6),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Root",
      false
    )
    expect(result.isLeaf).toBe(false)

    const rootChildren = (result as ChartDataInternalNode).children

    // Expect top-level children: Mörtel und Beton(1), Mineralwolle(2), Metalle(4)
    const mortarNode = rootChildren.find((c) => c.label === "Mörtel und Beton") as ChartDataInternalNode
    const mineralWoolNode = rootChildren.find((c) => c.label === "Mineralwolle") as ChartDataInternalNode
    const metalsNode = rootChildren.find((c) => c.label === "Metalle") as ChartDataInternalNode

    expect(mortarNode).toBeDefined()
    expect(mineralWoolNode).toBeDefined()
    expect(metalsNode).toBeDefined()

    // Mörtel und Beton
    expect(mortarNode.isLeaf).toBe(false)
    expect(mortarNode.children.length).toBe(1)

    const mortarGroupNode = mortarNode.children[0] as ChartDataInternalNode
    expect(mortarGroupNode.isLeaf).toBe(false)
    expect(mortarGroupNode.label).toBe("Concrete Mix A")
    expect(mortarGroupNode.children.length).toBe(1)

    const concreteLeaf = mortarGroupNode.children[0] as ChartDataLeaf
    expect(concreteLeaf.isLeaf).toBe(true)
    expect(concreteLeaf.label).toBe("Comp: 1")
    expect(concreteLeaf.metricValue).toBe(0.8)
    expect(concreteLeaf.dimensionalValue).toBe(100)

    // Check mortar aggregation:
    expect(mortarGroupNode.metricValue).toBe(0.8)
    expect(mortarGroupNode.dimensionalValue).toBe(100)
    expect(mortarNode.metricValue).toBe(0.8)
    expect(mortarNode.dimensionalValue).toBe(100)

    // Mineralwolle
    expect(mineralWoolNode.isLeaf).toBe(false)
    expect(mineralWoolNode.children.length).toBe(1)

    const mwGroupNode = mineralWoolNode.children[0] as ChartDataInternalNode
    expect(mwGroupNode.isLeaf).toBe(false)
    expect(mwGroupNode.label).toBe("Mineral Wool A")
    expect(mwGroupNode.children.length).toBe(1)

    const mineralWoolLeaf = mwGroupNode.children[0] as ChartDataLeaf
    expect(mineralWoolLeaf.isLeaf).toBe(true)
    expect(mineralWoolLeaf.label).toBe("Comp: 2")
    expect(mineralWoolLeaf.metricValue).toBe(0.9)
    expect(mineralWoolLeaf.dimensionalValue).toBe(50)

    // Check mineral wool aggregation:
    expect(mwGroupNode.metricValue).toBe(0.9)
    expect(mwGroupNode.dimensionalValue).toBe(50)
    expect(mineralWoolNode.metricValue).toBe(0.9)
    expect(mineralWoolNode.dimensionalValue).toBe(50)

    // Metalle(4) -> Stahl und Eisen(4.01)
    expect(metalsNode.isLeaf).toBe(false)
    expect(metalsNode.children.length).toBe(1)

    const steelNode = metalsNode.children[0] as ChartDataInternalNode
    expect(steelNode.isLeaf).toBe(false)
    expect(steelNode.label).toBe("Stahl und Eisen")

    // Inside Stahl und Eisen, we expect 2 product group nodes: "Steel Beam A", "Steel Beam B"
    const steelBeamAGroup = steelNode.children.find((c) => c.label === "Steel Beam A") as ChartDataInternalNode
    const steelBeamBGroup = steelNode.children.find((c) => c.label === "Steel Beam B") as ChartDataInternalNode

    expect(steelBeamAGroup).toBeDefined()
    expect(steelBeamAGroup.isLeaf).toBe(false)
    expect(steelBeamBGroup).toBeDefined()
    expect(steelBeamBGroup.isLeaf).toBe(false)

    // Each group node has exactly one leaf
    expect(steelBeamAGroup.children.length).toBe(1)
    expect(steelBeamBGroup.children.length).toBe(1)

    const steelBeamALeaf = steelBeamAGroup.children[0] as ChartDataLeaf
    expect(steelBeamALeaf.isLeaf).toBe(true)
    expect(steelBeamALeaf.label).toBe("Comp: 3")
    expect(steelBeamALeaf.metricValue).toBe(0.7)
    expect(steelBeamALeaf.dimensionalValue).toBe(120)

    const steelBeamBLeaf = steelBeamBGroup.children[0] as ChartDataLeaf
    expect(steelBeamBLeaf.isLeaf).toBe(true)
    expect(steelBeamBLeaf.label).toBe("Comp: 4")
    expect(steelBeamBLeaf.metricValue).toBe(0.6)
    expect(steelBeamBLeaf.dimensionalValue).toBe(80)

    // Check sub-aggregation inside each beam group
    expect(steelBeamAGroup.metricValue).toBe(0.7)
    expect(steelBeamAGroup.dimensionalValue).toBe(120)
    expect(steelBeamBGroup.metricValue).toBe(0.6)
    expect(steelBeamBGroup.dimensionalValue).toBe(80)

    // steelNode (Stahl und Eisen) aggregation:
    // Weighted average = (0.7*120 + 0.6*80) / 200 = 132 / 200 = 0.66
    expect(steelNode.metricValue).toBeCloseTo(0.66, 2)
    expect(steelNode.dimensionalValue).toBe(200)

    // metalsNode aggregation:
    expect(metalsNode.metricValue).toBeCloseTo(0.66, 2)
    expect(metalsNode.dimensionalValue).toBe(200)

    // Root aggregation:
    // total mass = 100 + 50 + 200 = 350
    // weighted avg = (0.8*100 + 0.9*50 + 0.66*200) / 350
    // = (80 + 45 + 132) / 350 = 257 / 350 ~= 0.7343
    expect(result.metricValue).toBeCloseTo(0.7343, 4)
    expect(result.dimensionalValue).toBe(350)
  })

  test("skipRootNode=true with a single top-level category hierarchy", () => {
    // Only one top-level category "Bindemittel" (1)
    const processCategories: ProcessCategory[] = [createProcessCategory(614, "Bindemittel", "1")]
    const products: MaterialNode[] = [
      createMaterialNode("uuid-binder", "Comp: binder", 501, "Binder Product", 614, 30, 60, 0.95),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Artificial Root",
      true
    )

    // Because there's exactly one top-level category, skipRootNode flattening applies:
    // So 'result' is "Bindemittel" as the top-level instead of "Artificial Root".
    expect(result.label).toBe("Bindemittel")
    expect(result.isLeaf).toBe(false)

    const categoryNode = result as ChartDataInternalNode
    expect(categoryNode.children.length).toBe(1)

    // Product group node: "Binder Product"
    const productGroupNode = categoryNode.children[0] as ChartDataInternalNode
    expect(productGroupNode.isLeaf).toBe(false)
    expect(productGroupNode.label).toBe("Binder Product")
    expect(productGroupNode.children.length).toBe(1)

    // Final leaf: "Comp: binder"
    const leaf = productGroupNode.children[0] as ChartDataLeaf
    expect(leaf.isLeaf).toBe(true)
    expect(leaf.label).toBe("Comp: binder")
    expect(leaf.metricValue).toBe(0.95)
    expect(leaf.dimensionalValue).toBe(60)
  })

  test("skipRootNode=true with multiple top-level categories does not flatten", () => {
    // Two top-level categories: Bindemittel(1), Mörtel und Beton(2)
    const processCategories: ProcessCategory[] = [
      createProcessCategory(614, "Bindemittel", "1"),
      createProcessCategory(617, "Mörtel und Beton", "2"),
    ]
    const products: MaterialNode[] = [
      createMaterialNode("uuid-binder", "Comp: binder", 501, "Binder Product", 614, 20, 40, 0.8),
      createMaterialNode("uuid-concrete", "Comp: concrete", 502, "Concrete Product", 617, 50, 100, 0.7),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Artificial Root",
      true
    )
    // Because multiple top-level categories exist, we keep the artificial root
    expect(result.label).toBe("Artificial Root")
    expect(result.isLeaf).toBe(false)

    const children = (result as ChartDataInternalNode).children
    expect(children.length).toBe(2)
    expect(children.some((c) => c.label === "Bindemittel")).toBe(true)
    expect(children.some((c) => c.label === "Mörtel und Beton")).toBe(true)
  })

  test("handles categories without products", () => {
    // A top-level category "Wärmedämmverbundsystem" (1) with no products
    const processCategories: ProcessCategory[] = [createProcessCategory(640, "Wärmedämmverbundsystem", "1")]
    const products: MaterialNode[] = []

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Root",
      false
    )
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
      createMaterialNode("uuid-specialsteel", "Comp: specialsteel", 9999, "Special Steel Product", 999, 15, 30, 0.85),
    ]

    const result = transformCircularityDataAndMaterialTypesToChartData(
      processCategories,
      products,
      "mass",
      "Root",
      false
    )

    // Root -> Metalle(4) -> Stahl und Eisen(4.01) -> Spezialstahl(4.01.1)
    const rootChildren = (result as ChartDataInternalNode).children
    const metalleNode = rootChildren.find((c) => c.label === "Metalle") as ChartDataInternalNode
    expect(metalleNode).toBeDefined()
    expect(metalleNode.isLeaf).toBe(false)

    const stahlEisenNode = metalleNode.children.find((c) => c.label === "Stahl und Eisen") as ChartDataInternalNode
    expect(stahlEisenNode).toBeDefined()
    expect(stahlEisenNode.isLeaf).toBe(false)

    const spezialStahlNode = stahlEisenNode.children.find((c) => c.label === "Spezialstahl") as ChartDataInternalNode
    expect(spezialStahlNode).toBeDefined()
    expect(spezialStahlNode.isLeaf).toBe(false)

    // Inside 'Spezialstahl', there should be a product-group node: "Special Steel Product"
    expect(spezialStahlNode.children.length).toBe(1)
    const productGroupNode = spezialStahlNode.children[0] as ChartDataInternalNode
    expect(productGroupNode.isLeaf).toBe(false)
    expect(productGroupNode.label).toBe("Special Steel Product")

    // Now, the final leaf inside that product group has label "Comp: specialsteel"
    expect(productGroupNode.children.length).toBe(1)
    const specialSteelLeaf = productGroupNode.children[0] as ChartDataLeaf
    expect(specialSteelLeaf.isLeaf).toBe(true)
    expect(specialSteelLeaf.label).toBe("Comp: specialsteel")
    expect(specialSteelLeaf.metricValue).toBe(0.85)
    expect(specialSteelLeaf.dimensionalValue).toBe(30)
  })
})
