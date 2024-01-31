import { configDotenv } from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({path: __dirname + '/../../.env'});
const listSites = async ()=>{

}
export default listSites;