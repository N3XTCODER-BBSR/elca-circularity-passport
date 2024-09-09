import { Accordion } from "@szhsin/react-accordion"
import { AccordionItem } from "app/(components)/(generic)/Accordion/AccordionItem"

const DummyAccordion = () => (
  <div className="mx-2 border-t">
    <Accordion transition transitionTimeout={200}>
      <AccordionItem header="Was ist der RMI renewable?">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </AccordionItem>

      <AccordionItem header="Warum ist der RMI renewable wichtig für die Nachhaltigkeit?">
        Quisque eget luctus mi, vehicula mollis lorem. Proin fringilla vel erat quis sodales. Nam ex enim, eleifend
        venenatis lectus vitae.
      </AccordionItem>
    </Accordion>
  </div>
)

export default DummyAccordion
