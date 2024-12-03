"use client"

import { ArrowLongLeftIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"

const HistoryBackButton = () => {
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1)
    }
  }, [])

  const handleGoBack = () => {
    window.history.back()
  }

  if (canGoBack) {
    return (
      <button
        className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-8 py-2 text-sm font-semibold text-blue-900"
        onClick={handleGoBack}
        // href={`/${params.locale}/projects/${params.projectId}/catalog#${componentData?.din_code}`}
      >
        <ArrowLongLeftIcon aria-hidden="true" className="-ml-0.5 size-5" />
        Zurück
      </button>
    )
  }
}

export default HistoryBackButton
