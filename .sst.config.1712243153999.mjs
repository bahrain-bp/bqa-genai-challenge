import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);

// stacks/AuthStack.ts
import { Cognito } from "sst/constructs";

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "codecatalyst-sst-app",
      region: "us-east-1"
    };
  }
};
export {
  sst_config_default as default
};
