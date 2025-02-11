export const performanceMetricsArtifactsName = "performance-metrics"

export const pages = {
  projectsPage: "/projects",
  variantsPage: "/projects/<projectId>/variants",
  overviewPage: "/projects/<projectId>/variants/<variantId>",
  passportsPage: "/projects/<projectId>/variants/<variantId>/passports",
  catalogPage: "/projects/<projectId>/variants/<variantId>/catalog",
  componentPage: "/projects/<projectId>/variants/<variantId>/catalog/components/<componentId>",
}

// TODO: all resource ids and the userId should be dynamic and passed as environment variables
export const users = {
  "elcadevs+01@n3xtcoder.org": {
    projectId: "42403",
    variantId: "83236",
    componentId: "0706cb3d-4c9b-438d-ac28-c801b87a7fe7",
  },
  "elcadevs+02@n3xtcoder.org": {
    projectId: "42404",
    variantId: "83237",
    componentId: "eee542d4-47d7-4edd-b818-099b4bda7fc8",
  },
  "elcadevs+03@n3xtcoder.org": {
    projectId: "42402",
    variantId: "83235",
    componentId: "5b726aed-1d78-4e9c-8d70-75c1021949dc",
  },
}
