import { DismantlingPotentialClassId } from "prisma/generated/client"

// TODO: Move the labels over into translations
const dismantlingPotentialClassIdMapping = {
  [DismantlingPotentialClassId.I]: {
    label: "zerstörungsfrei rückbaubar",
    points: 100,
  },
  [DismantlingPotentialClassId.II]: {
    label: "zerstörungsarm rückbaubar",
    points: 75,
  },
  [DismantlingPotentialClassId.III]: {
    label: "zerstörend ohne Fremd-/Störst. rückb.",
    points: 50,
  },
  [DismantlingPotentialClassId.IV]: {
    label: "nur mit Fremd-/Störstoffen rückbaubar",
    points: 0,
  },
}

export default dismantlingPotentialClassIdMapping
