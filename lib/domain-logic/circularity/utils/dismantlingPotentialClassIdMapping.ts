import { DismantlingPotentialClassId } from "prisma/generated/client"

// TODO: Move the labels over into translations
export const dismantlingPotentialClassIdMapping = {
  [DismantlingPotentialClassId.I]: {
    translationKey: 1,
    points: 100,
  },
  [DismantlingPotentialClassId.II]: {
    translationKey: 2,
    points: 75,
  },
  [DismantlingPotentialClassId.III]: {
    translationKey: 3,
    points: 50,
  },
  [DismantlingPotentialClassId.IV]: {
    translationKey: 4,
    points: 0,
  },
}

export default dismantlingPotentialClassIdMapping
