"use server"

import { notFound } from "next/navigation"
import ProjectData from "./(components)/ProjectData"

// Basic layout components for PDF
const Header = ({ projectName, variantName }: { projectName: string; variantName: string }) => (
  <div className="header h-[15mm] bg-gray-600 py-[2mm] text-white">
    <div className="mx-[5mm] pl-[2mm] pt-[1mm] leading-none tracking-tight">
      <h1 className="font-normal">Project: {projectName}</h1>
      <h2 className="mt-[1.5mm] font-bold">Variant: {variantName}</h2>
    </div>
  </div>
)

const Content = ({ children }: { children: React.ReactNode }) => (
  <div className="content keep-together mx-[5mm] box-border flex-1 overflow-hidden px-[2mm]">{children}</div>
)

const Footer = ({ projectId, variantId }: { projectId: string; variantId: string }) => (
  <div className="footer h-[10mm] border-t border-gray-300 bg-gray-100 py-[2mm] text-[8pt] text-gray-600">
    <div className="mx-[5mm] flex justify-between">
      <div>
        Project ID: {projectId} | Variant ID: {variantId}
      </div>
      <div>Generated on: {new Date().toLocaleDateString("de-DE")}</div>
    </div>
  </div>
)

const Page = async ({ params }: { params: { projectId: string; variantId: string } }) => {
  // For demo purposes, using static content
  // In real implementation, fetch project and variant data here
  const projectName = "Demo Project"
  const variantName = "Demo Variant"

  if (!params.projectId || !params.variantId) {
    notFound()
  }

  // Demo project data
  const projectData = {
    projectId: params.projectId,
    address: {
      city: "Berlin",
      postalCode: "10115",
      street: "Alexanderplatz",
      houseNumber: "1",
    },
    bnbNumber: "BNB2.0/01/0001",
    bnbCoordinator: "Max Mustermann",
  }

  return (
    <>
      <Header projectName={projectName} variantName={variantName} />
      <Content>
        <ProjectData {...projectData} />
      </Content>
      <Footer projectId={params.projectId} variantId={params.variantId} />
    </>
  )
}

export default Page
