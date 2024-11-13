import { Accordion } from "@szhsin/react-accordion"
import { AccordionItem } from "app/(components)/generic/AccordionItem"

type FaqProps = {
  faqContent: {
    Q: string
    A: string
  }[]
}

const Faq: React.FC<FaqProps> = ({ faqContent = [] }) => {
  return (
    <div className="mx-2 border-t">
      <Accordion transition transitionTimeout={200}>
        {faqContent.map((faqItem, index) => (
          <AccordionItem key={index} header={faqItem["Q"]}>
            {faqItem["A"]}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default Faq
