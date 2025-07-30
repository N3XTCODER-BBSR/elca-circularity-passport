interface ProjectDataProps {
  projectId: string
  address: string
  bnbNumber: string
  bnbCoordinator: string
  creationDate: string
  projectName: string
}

export function ProjectData({
  projectId,
  address,
  bnbNumber,
  bnbCoordinator,
  creationDate,
  projectName,
}: ProjectDataProps) {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-8 gap-y-2">
      <div className="font-semibold">Projektname:</div>
      <div>{projectName}</div>

      <div className="font-semibold">Projekt ID:</div>
      <div>{projectId}</div>

      <div className="font-semibold">Adresse:</div>
      <div>{address}</div>

      <div className="font-semibold">BNB-Nummer:</div>
      <div>{bnbNumber}</div>

      <div className="font-semibold">BNB-Koordinator:</div>
      <div>{bnbCoordinator}</div>

      <div className="font-semibold">Erstellungsdatum:</div>
      <div>{creationDate}</div>
    </div>
  )
}
