"use client"

import BarChart from "../../BarChart"

const Materials = () => {
  const keys = ["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]

  const chartData = [
    {
      country: "AD",
      "hot dog": 101,
      "hot dogColor": "hsl(145, 70%, 50%)",
      burger: 148,
      burgerColor: "hsl(271, 70%, 50%)",
      sandwich: 125,
      sandwichColor: "hsl(265, 70%, 50%)",
      kebab: 171,
      kebabColor: "hsl(257, 70%, 50%)",
      fries: 20,
      friesColor: "hsl(135, 70%, 50%)",
      donut: 151,
      donutColor: "hsl(246, 70%, 50%)",
    },
    {
      country: "AE",
      "hot dog": 52,
      "hot dogColor": "hsl(286, 70%, 50%)",
      burger: 45,
      burgerColor: "hsl(86, 70%, 50%)",
      sandwich: 100,
      sandwichColor: "hsl(241, 70%, 50%)",
      kebab: 59,
      kebabColor: "hsl(170, 70%, 50%)",
      fries: 83,
      friesColor: "hsl(94, 70%, 50%)",
      donut: 61,
      donutColor: "hsl(81, 70%, 50%)",
    },
    {
      country: "AF",
      "hot dog": 126,
      "hot dogColor": "hsl(244, 70%, 50%)",
      burger: 143,
      burgerColor: "hsl(237, 70%, 50%)",
      sandwich: 83,
      sandwichColor: "hsl(335, 70%, 50%)",
      kebab: 164,
      kebabColor: "hsl(182, 70%, 50%)",
      fries: 194,
      friesColor: "hsl(257, 70%, 50%)",
      donut: 31,
      donutColor: "hsl(169, 70%, 50%)",
    },
    {
      country: "AG",
      "hot dog": 100,
      "hot dogColor": "hsl(306, 70%, 50%)",
      burger: 69,
      burgerColor: "hsl(212, 70%, 50%)",
      sandwich: 117,
      sandwichColor: "hsl(30, 70%, 50%)",
      kebab: 94,
      kebabColor: "hsl(164, 70%, 50%)",
      fries: 90,
      friesColor: "hsl(167, 70%, 50%)",
      donut: 187,
      donutColor: "hsl(260, 70%, 50%)",
    },
    {
      country: "AI",
      "hot dog": 173,
      "hot dogColor": "hsl(170, 70%, 50%)",
      burger: 46,
      burgerColor: "hsl(49, 70%, 50%)",
      sandwich: 199,
      sandwichColor: "hsl(338, 70%, 50%)",
      kebab: 105,
      kebabColor: "hsl(109, 70%, 50%)",
      fries: 180,
      friesColor: "hsl(199, 70%, 50%)",
      donut: 50,
      donutColor: "hsl(140, 70%, 50%)",
    },
    {
      country: "AL",
      "hot dog": 151,
      "hot dogColor": "hsl(355, 70%, 50%)",
      burger: 105,
      burgerColor: "hsl(355, 70%, 50%)",
      sandwich: 78,
      sandwichColor: "hsl(178, 70%, 50%)",
      kebab: 143,
      kebabColor: "hsl(280, 70%, 50%)",
      fries: 101,
      friesColor: "hsl(223, 70%, 50%)",
      donut: 140,
      donutColor: "hsl(6, 70%, 50%)",
    },
    {
      country: "AM",
      "hot dog": 110,
      "hot dogColor": "hsl(146, 70%, 50%)",
      burger: 131,
      burgerColor: "hsl(209, 70%, 50%)",
      sandwich: 136,
      sandwichColor: "hsl(258, 70%, 50%)",
      kebab: 189,
      kebabColor: "hsl(278, 70%, 50%)",
      fries: 132,
      friesColor: "hsl(198, 70%, 50%)",
      donut: 170,
      donutColor: "hsl(150, 70%, 50%)",
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
