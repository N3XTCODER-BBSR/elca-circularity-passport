export class MissingVolumeError extends Error {
  constructor(message = "At least one layer does not have a volume") {
    super(message)
  }
}
