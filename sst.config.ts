import { SSTConfig } from "sst";

import { S3Stack } from "./stacks/S3Stack"
import { S3 } from "aws-cdk-lib/aws-ses-actions";

import { AuthStack } from "./stacks/AuthStack";
import { ApiStack } from "./stacks/ApiStack";
import { } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { DBStack } from "./stacks/DBStack";
import { WebSocketStack } from "./stacks/WebSocketStack";
//import { S3Stack } from "./stacks/S3Stack"
import { ImageBuilderForCodeCatalyst } from "./stacks/devops/ImageBuilderForCodeCatalyst";
import { OIDCForGitHubCI } from "./stacks/devops/OIDCForGitHubCI";

export default {
  config(_input) {
    return {
      name: "codecatalyst-sst-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }

    if (app.stage == "devops-coca") {
      app.stack(ImageBuilderForCodeCatalyst);
    } else if (app.stage == "devops-gh") {
      app.stack(OIDCForGitHubCI);
    } else {
      app
        .stack(DBStack)
        .stack(S3Stack)
        .stack(AuthStack)
        .stack(ApiStack)

        // .stack(StandardAPIStack)

        .stack(FrontendStack)
        // .stack(WebSocketStack)
    }
  },
} satisfies SSTConfig;
