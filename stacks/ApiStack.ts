import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { AuthStack } from "./AuthStack";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { table } = use(DBStack);
  // const { table, Sumtable } = use(DBStack);

  const api = new Api(stack, "signinAPI", {
    // Commented out the authorizers section
    // authorizers: {
    //   jwt: {
    //     type: "user_pool",
    //     userPool: {
    //       id: auth.userPoolId,
    //     },
    //   },
    // },
    defaults: {
      function: {
        bind: [table], // Bind the table name to our API
        // bind: [table, Sumtable], // Bind the table name to our API
      },
      // Optional: Remove authorizer from defaults if set to "jwt"
      // authorizer: "jwt",
    },
    routes: {
      // Standards api routes
      "POST /standards": "packages/functions/src/standards/create.main",
      "GET /standards/{id}": "packages/functions/src/standards/get.main",
      "GET /standards": "packages/functions/src/standards/list.main",
      "PUT /standards/{id}": "packages/functions/src/standards/update.main",
      "DELETE /standards/{id}": "packages/functions/src/standards/delete.main",

      // FileSummarization api routes
      "POST /fileSummary": "packages/functions/src/fileSummary/create.main",
      "GET /fileSummary/{id}": "packages/functions/src/fileSummary/get.main",
      "GET /fileSummary": "packages/functions/src/fileSummary/list.main",
      "PUT /fileSummary/{id}": "packages/functions/src/fileSummary/update.main",
      "DELETE /fileSummary/{id}": "packages/functions/src/fileSummary/delete.main",

      // Email API routes
      "POST /send-email": {
        function: {
          handler: "packages/functions/src/send-email.sendEmail",
          permissions: ["ses"]
        }
      },
      // Sample TypeScript lambda function
      "POST /": "packages/functions/src/lambda.main",
      "POST /uploadS3": {
        function: {
          handler: "packages/functions/src/s3Upload.uploadToS3",
          permissions: ["s3"]
        }
      },
      "GET /detectFileType": {
        function: {
          handler: "packages/functions/detectFileType.detect",
          permissions: ["s3"],
        }
      },
      "GET /private": "packages/functions/src/private.main",
      // Another sample TypeScript lambda function
      "POST /private": "packages/functions/src/private.main",
      // Sample Python lambda function
      "GET /": {
        function: {
          handler: "packages/functions/src/sample-python-lambda/lambda.main",
          runtime: "python3.11",
          timeout: "60 seconds",
        }
      },
      // Add the new route for retrieving files
      "GET /files": {
        function: {
          handler: "packages/functions/src/retrieveS3.main", // Replace with your location
          permissions: ["s3"], // Grant necessary S3 permissions
        },
      },
    },
  });

  // Define cache policy for the API
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration.seconds(0), // No cache by default unless backend decides otherwise
    defaultTtl: Duration.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer"
    ),
  });

  // Add outputs
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api, apiCachePolicy };
}
