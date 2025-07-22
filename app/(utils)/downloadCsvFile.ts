export const downloadCsvFile = (filename: string, csvContent: Buffer, charset: string = "iso-8859-15") => {
  const blob = new Blob([csvContent], { type: `text/csv;charset=${charset};` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)

  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url) // Clean up the URL object
}
