const MetricSelector = () => {
  return (
    <div className="flex">
      <div className="w-1/3 pr-6">
        <ul className="mx-2 space-y-1">
          {din276WithComponents.map((group) => {
            return (
              <li className="mb-8" key={group.groupNumber}>
                <h2 className="mb-4 text-sm uppercase">{tCostGroups(group.groupNumber.toString())}</h2>
                <nav aria-label="Sidebar" className="flex flex-1 flex-col">
                  <ul className="-mx-2 space-y-1">
                    {group.categories.map((componentsByCategory) => {
                      const hasAnyCircularityMissingData1 =
                        !!showIncompleteCompleteLabels &&
                        componentsByCategory.componentTypes.some((componentType) =>
                          componentType.components.some((component) => {
                            return componentUuiddsWithMissingCircularityIndexForAnyProduct?.includes(component.uuid)
                          })
                        )
                      return (
                        <li key={componentsByCategory.categoryNumber}>
                          <button
                            onClick={() => onUpdateCateogryClick(componentsByCategory.categoryNumber)}
                            type="button"
                            className={twMerge(
                              selectedCategoryNumber === componentsByCategory.categoryNumber
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex w-full gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
                            )}
                          >
                            <div className="flex w-full items-center gap-x-3">
                              <div className="text-left">
                                {componentsByCategory.categoryNumber}{" "}
                                {tCostGroups(componentsByCategory.categoryNumber.toString())}
                              </div>

                              {componentsByCategory.numberOfComponents !== 0 && (
                                <NumberOfChildComponents
                                  numberOfComponents={componentsByCategory.numberOfComponents}
                                  hasAnyCircularityMissingData={hasAnyCircularityMissingData1}
                                />
                              )}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default MetricSelector
