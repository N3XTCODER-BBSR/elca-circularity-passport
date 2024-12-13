import { FC } from "react"

type ProjectInfoProps = {
  projectName: string
}

const ProjectInfo: FC<ProjectInfoProps> = ({ projectName }) => (
  <div className="hidden sm:ml-6 sm:flex sm:space-x-8 lg:ml-0">
    <span className="text-xs text-indigo-500">Project: {projectName}</span>
  </div>
)

export default ProjectInfo
