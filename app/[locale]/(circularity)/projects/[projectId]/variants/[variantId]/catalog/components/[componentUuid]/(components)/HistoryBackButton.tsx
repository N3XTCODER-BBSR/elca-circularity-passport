"use client"

import { useEffect, useState } from "react"
import BackButton from "app/(components)/generic/BackButton"

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
    return <BackButton handleOnClick={handleGoBack} text="Zurück" />
  }
}

export default HistoryBackButton
