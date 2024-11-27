const CircularityIndexTotal = ({ circularityIndexPoints }: { circularityIndexPoints: number }) => {
  const circularityIndexPointsStr = `${circularityIndexPoints.toFixed(2)} points`
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex gesamt</h2>
      <div className="mt-4 rounded-lg border-2 px-8 py-4 text-3xl font-bold">{circularityIndexPointsStr}</div>
      {/* <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="text-4xl font-bold text-gray-600 dark:text-gray-400">0</div>
        <div className="text-sm font-bold text-gray-600 dark:text-gray-400">%</div>
      </div>
      <div className="mt-4 text-sm font-bold text-gray-600 dark:text-gray-400">Zirkularitätsindex</div> */}
    </div>
  )
}

export default CircularityIndexTotal
