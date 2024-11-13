import csv from 'csv-parser';
import fs from 'fs';
import { OekobaudatToProductAndCategoryMapping, OekobaudatToProductAndCategoryMappingSchema } from './dbSeeder';


// Use Zod to validate CSV rows
const results: OekobaudatToProductAndCategoryMapping[] = [];

fs.createReadStream('./obd_tbaustoff_mapping.csv')
  .pipe(csv())
  .on('data', (row) => {
    const oekobaudatUuids = {
      "448d1096-2017-4901-a560-f652a83c737e": row["oekobaudatUuid____448d1096-2017-4901-a560-f652a83c737e____2020-II"] || null,
      "22885a6e-1765-4ade-a35e-ae668bd07256": row["oekobaudatUuid____22885a6e-1765-4ade-a35e-ae668bd07256____2023-I"] || null,
      "XXXXXXXXXXXX": row["oekobaudatUuid____XXXXXXXXXXXX____2024-I"] || null,
    };

    const mapping = {
      oekobaudatName: row["oekobaudatName"],
      oekobaudatUuids: oekobaudatUuids,
      tBaustoffName: row["tBaustoffName"],
      eolCategoryUuid: row["eolCategoryName"],
    };

    try {
      // Validate the mapping with Zod
      const validMapping = OekobaudatToProductAndCategoryMappingSchema.parse(mapping);
      results.push(validMapping);
    } catch (error: any) {
      console.error('Invalid row:', error.errors);
    }
  })
  .on('end', () => {
    // Convert the results to JSON format and write to a file
    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
    console.log('CSV file successfully processed and JSON file created.');
  });