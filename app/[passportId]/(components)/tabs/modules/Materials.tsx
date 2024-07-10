"use client"

import BarChart from "../../BarChart"

const Materials = () => {
  const keys = ["hot dog", "burger", "sandwich", "kebab"]

  const chartData = [
    {
      country: "AD",
      "hot dog": 101,
      burger: 148,
      sandwich: 125,
      kebab: 171,
    },
    {
      country: "AE",
      "hot dog": 52,
      burger: 45,
      sandwich: 100,
      kebab: 59,
    },
    {
      country: "AF",
      "hot dog": 126,
      burger: 143,
      sandwich: 83,
      kebab: 164,
    },
    {
      country: "AG",
      "hot dog": 100,
      burger: 69,
      sandwich: 117,
      kebab: 94,
    },
  ]
  return (
    <div>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Modul 1
      </h2>
      <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Materialien
      </h3>
      <div className="h-[300px]">
      <BarChart data={chartData} indexBy={"country"} keys={keys} />
      </div>
    </div>
  )
}

export default Materials
