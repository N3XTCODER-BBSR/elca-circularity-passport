import _ from "lodash"
import { cache } from "react"
import { ElcaProjectComponent, ElcaProjectInfo } from "app/[locale]/(circularity)/(utils)/types"
import { query } from "lib/elca-legacy-db"

export type DataResult = {
  projectInfo: ElcaProjectInfo
  projectComponents: ElcaProjectComponent[]
} | null

export const fetchProjectDataCachedDuringRequest = cache(
  async (projectId: string, userId: string): Promise<DataResult> => {
    console.log(`Fetching project data for project ID ${projectId} and user ID ${userId}`)
    const result = await query(
      `
      WITH project_info AS (
  SELECT id, name AS project_name
  FROM elca.projects
  WHERE owner_id = $1 AND id = $2
),
project_components AS (
  SELECT
    e.uuid AS element_uuid,
    ec.id AS component_id,
    ec.layer_position AS layer_position,
    pr.process_db_id AS pr_pdb_id,
    pr.name AS process_name,
    pr.ref_value AS process_ref_value,
    pr.ref_unit AS process_ref_unit,
    pdb.id AS pdb_id,
    pdb.name AS pdb_name,
    pdb.version AS pdb_version,
    pla.id AS pla_id,
    pc.uuid AS process_config_uuid,
    e.name AS element_name,
    et.name AS element_type_name,
    et.din_code AS din_code,
    e.ref_unit AS unit,
    ec.quantity AS quantity,
    ec.layer_size AS layer_size,
    ec.layer_length AS layer_length,
    ec.layer_width AS layer_width,
    -- ec_att.text_value AS layer_name,
    pc.density AS process_config_density,
    pc.name AS process_config_name
    FROM elca.elements e
    JOIN elca.project_variants pv ON pv.id = e.project_variant_id
    JOIN elca.projects p ON p.id = pv.project_id
    JOIN elca.element_types et ON et.node_id = e.element_type_node_id
    LEFT JOIN elca.element_components ec ON e.id = ec.element_id
    LEFT JOIN elca.element_component_attributes ec_att ON ec_att.element_component_id = ec.id
    LEFT JOIN elca.process_configs pc ON pc.id = ec.process_config_id
    LEFT JOIN elca.process_life_cycle_assignments pla ON pla.process_config_id = pc.id
    LEFT JOIN elca.processes pr ON pla.process_id = pr.id
    LEFT JOIN elca.life_cycles lc ON lc.ident = pr.life_cycle_ident
    LEFT JOIN elca.process_dbs pdb ON pdb.id = pr.process_db_id
    WHERE p.owner_id = $1 AND p.id = $2 AND lc.phase = 'prod' AND pr.process_db_id = (
        SELECT id FROM elca.process_dbs WHERE uuid = 'aa9f7c8d-a9f7-5870-bd94-54e520bf3182' AND version = '2011'
      )
    ORDER BY element_uuid, layer_position, component_id, process_config_uuid
)
SELECT
  (SELECT json_agg(project_info.*) FROM project_info) AS project_info,
  (SELECT json_agg(project_components.*) FROM project_components) AS project_components;
      `,
      [userId, projectId]
    )

    if (result.rows.length === 0 || !result.rows[0].project_info || result.rows[0].project_info.length < 1) {
      console.error(`Project with ID ${projectId} not found for user ${userId}`)
      return null
    }

    if (result.rows.length !== 1) {
      console.error(`Unexepcted number of query result rows: ${result.rows.length}`)
      return null
    }

    if (result.rows[0] == null) {
      console.error(`Unexpected query result: ${result.rows[0]}`)
      return null
    }

    if (result.rows[0].project_info.length !== 1) {
      console.error(`Unexepcted number of project_info rows: ${result.rows[0].project_info.length}`)
      return null
    }

    const projectInfo = result.rows[0].project_info[0]

    const projectComponents = result.rows[0].project_components

    const projectComponentsWithLayers = _(projectComponents)
      .groupBy("element_uuid")
      .map((components, element_uuid) => {
        const { element_name, element_type_name, din_code, unit } = components[0]

        return {
          element_uuid,
          element_name,
          element_type_name,
          din_code,
          unit,
          layers: _(components)
            .filter(({ component_id }) => component_id != null)
            .map(
              ({
                layer_position,
                quantity,
                layer_length,
                layer_width,
                layer_size,
                // layer_name,
                process_name,
                process_config_density,
                process_config_name,
                process_config_uuid,
              }) => ({
                layer_position,
                quantity,
                layer_length,
                layer_width,
                layer_size,
                // layer_name,
                process_name,
                process_config_density,
                process_config_name,
                process_config_uuid,
              })
            )
            .sortBy("layer_position")
            .value(),
        }
      })
      .value()

    console.log("FOO projectComponentsWithLayers", JSON.stringify(projectComponentsWithLayers, null, 2))

    return {
      projectInfo,
      projectComponents: projectComponentsWithLayers,
    }
  }
)
