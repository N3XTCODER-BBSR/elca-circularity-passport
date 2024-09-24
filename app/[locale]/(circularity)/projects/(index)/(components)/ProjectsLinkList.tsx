import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { ElcaProjectInfo } from "../../../(utils)/types"

type ProjectsLinkListProps = {
  projects: ElcaProjectInfo[]
}

const ProjectsLinkList = ({ projects }: ProjectsLinkListProps) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {projects.map((project) => (
        <li key={project.id}>
          <a
            className="flex items-center justify-between gap-x-6 px-2 py-5 hover:bg-gray-50"
            href={`/projects/${project.id}`}
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-gray-900">{project.project_name}</p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p className="whitespace-nowrap">
                  Created at{" "}
                  <time dateTime={project.created_at.toLocaleDateString()}>
                    {project.created_at.toLocaleDateString()}
                  </time>
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">Created by {project.created_by_user_name}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <ChevronRightIcon className="size-5" aria-hidden="true" />
              <span className="sr-only">View project, {project.project_name}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default ProjectsLinkList
