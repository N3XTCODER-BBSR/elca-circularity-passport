import { AccordionItemProps, AccordionItem as Item } from "@szhsin/react-accordion"
import  Image  from "next/image"

interface CustomAccordionItemProps extends Omit<AccordionItemProps, "header"> {
  header: React.ReactNode
  rest?: any
}

export const AccordionItem: React.FC<CustomAccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        <b>{header}</b>
        <Image
          src="/chevron-down.svg"
          width={24}
          height={24}
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
          alt="Chevron"
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) => `flex w-full p-4 text-left hover:bg-slate-100 ${isEnter && "bg-slate-200"}`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-4" }}
  />
)
