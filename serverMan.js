#!/usr/bin/env node

import init from "./init.js";
import {setupConfiguration, exsistEnvFile} from "./utilities/makeConfigs.js";
!exsistEnvFile() ? setupConfiguration() : init();