import init from "./init.js";
import fs from "fs";
import {setupConfiguration} from "./utilities/makeConfigs.js";
!fs.existsSync("./.env") ? setupConfiguration() : init();