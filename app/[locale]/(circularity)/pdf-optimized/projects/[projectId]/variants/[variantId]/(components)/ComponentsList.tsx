import { formatNumber, formatRoman } from "lib/presentation-logic/formatters"

interface Material {
  name: string
  mass: number
  volume: number
  unit: string
  dismantling: {
    points: number
    class: string
  }
  circularity: {
    points: number
    class: string
  }
}

interface Component {
  name: string
  uuid: string
  costGroup: string
  quantity: number
  referenceUnit: string
  materials: Material[]
}

interface ComponentsListProps {
  components: Component[]
}

export function ComponentsList({ components }: ComponentsListProps) {
  return (
    <div className="space-y-6">
      {components.map((component, index) => (
        <div key={index} className="print-avoid-break rounded border border-gray-200 p-4 shadow-sm">
          {/* Component name as header */}
          <h3 className="mb-4">{component.name}</h3>

          {/* Properties in 2-column layout */}
          <div className="mb-3 grid grid-cols-2 gap-x-12 gap-y-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-4">
              <div className="font-semibold">UUID:</div>
              <div>{component.uuid}</div>

              <div className="font-semibold">Kostengruppe:</div>
              <div>{component.costGroup}</div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-x-4">
              <div className="font-semibold">Installierte Anzahl:</div>
              <div>{formatNumber(component.quantity, 2)}</div>

              <div className="font-semibold">Referenzeinheit:</div>
              <div>{component.referenceUnit}</div>
            </div>
          </div>

          {/* Materials table */}
          <div className="keep-together mt-4">
            <div className="mb-2 text-right text-sm italic text-gray-600">Angaben pro {component.referenceUnit}</div>
            <table className="w-full">
              <thead className="border-b border-gray-300 text-sm">
                <tr className="text-xs leading-tight">
                  <th className="px-2 pb-2 text-left">Material</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right">Volumen</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right">Gewicht</th>
                  <th className="px-2 pb-2 text-center" colSpan={2}>
                    Rückbaupotenzial
                  </th>
                  <th className="px-2 pb-2 text-center" colSpan={2}>
                    Zirkularitätspotenzial
                  </th>
                </tr>
                <tr className="text-xs leading-tight text-gray-500">
                  <th className="px-2 pb-2 text-left font-normal"></th>
                  <th className="min-w-[60px] px-2 pb-2 text-right font-normal">m³</th>
                  <th className="min-w-[60px] px-2 pb-2 text-right font-normal">kg</th>
                  <th className="min-w-[50px] px-2 pb-2 text-right font-normal">Punkte</th>
                  <th className="min-w-[50px] px-2 pb-2 text-left font-normal">Klasse</th>
                  <th className="min-w-[50px] px-2 pb-2 text-right font-normal">Punkte</th>
                  <th className="min-w-[50px] px-2 pb-2 text-left font-normal">Klasse</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {component.materials.map((material, mIndex) => (
                  <tr key={mIndex} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{material.name}</td>
                    <td className="py-2 text-right">{formatNumber(material.volume, 3)}</td>
                    <td className="py-2 text-right">{formatNumber(material.mass, 1)}</td>
                    <td className="py-2 text-right">{formatNumber(material.dismantling.points)}</td>
                    <td className="py-2 pl-4">{formatRoman(material.dismantling.class)}</td>
                    <td className="py-2 text-right">{formatNumber(material.circularity.points)}</td>
                    <td className="py-2 pl-4">{material.circularity.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
