import toast, { Toast } from "react-hot-toast"
import { ZodIssue } from "zod"
import { fromZodIssue } from "zod-validation-error"

export function invalidPassportDataToast(t: Toast, zodIssues: ZodIssue[], errorMessage: string) {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } ring-opacity/5 pointer-events-auto flex w-full max-w-2xl rounded-lg bg-white shadow-lg ring-1 ring-black`}
    >
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-orange-900">{errorMessage}</p>
            <ul className="mt-1 text-sm text-gray-500">
              {zodIssues.map((zodIssue, i) => (
                <li className="mb-4" key={i}>
                  {fromZodIssue(zodIssue).toString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-bbsr-blue-700 hover:text-bbsr-blue-500 focus:outline-none focus:ring-2 focus:ring-bbsr-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  )
}
