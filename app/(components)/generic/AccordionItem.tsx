import { AccordionItemProps, AccordionItem as Item } from "@szhsin/react-accordion"
import Image from "next/image"

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

export const AccordionItemFull: React.FC<CustomAccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
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
      className: ({ isEnter }) =>
        `flex w-full pt-4 pb-4 font-semibold text-left text-lg leading-6 text-gray-900 hover:bg-slate-100 ${
          isEnter && ""
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "mt-4" }}
  />
)

export const AccordionItemFullSimple: React.FC<CustomAccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <Image
          src="/chevron-down.svg"
          width={24}
          height={24}
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`}
          alt="Chevron"
        />
      </>
    )}
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full mt-4 min-height-8 max-height-8 font-semibold text-left text-lg leading-6 text-gray-900 hover:bg-slate-100 ${
          isEnter && ""
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "mt-4" }}
  />
)
