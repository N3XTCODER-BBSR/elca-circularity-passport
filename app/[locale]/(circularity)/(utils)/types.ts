export type ElcaProjectInfo = {
  id: number
  project_name: string
  created_at: Date
  created_by_user_name: string
}

export type ElcaProjectComponentLayer = {
  // layer_name: string
  layer_position: number
  quantity: number
  layer_size: number
  layer_width: number
  layer_length: number
  process_name: string
  process_config_name: string
  process_config_density: number
  process_config_uuid: string
}

export type ElcaProjectComponent = {
  element_uuid: string
  element_type_name: string
  element_name: string
  din_code: string
  layers: ElcaProjectComponentLayer[]
  unit: string
}
