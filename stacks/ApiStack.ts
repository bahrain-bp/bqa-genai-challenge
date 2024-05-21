import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { AuthStack } from "./AuthStack";
import { S3Stack } from "./S3Stack";
import * as iam from "@aws-cdk/aws-iam";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);
  const { table, fileTable, criteriaTable, universityTable } = use(DBStack);
  const { documentsQueue } = use(S3Stack);

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
        bind: [table, fileTable, criteriaTable,universityTable], // Bind the table name to our API
      },
      // Optional: Remove authorizer from defaults if set to "jwt"
      // authorizer: "jwt",
    },
    routes: {
      //  Email API route
        "POST /send-email": 
        {
            function:
            {
                handler: "packages/functions/src/send-email.sendEmail",
                permissions: ["ses"]
            }
        },
      // Sample TypeScript lambda function
      "POST /": "packages/functions/src/lambda.main",
      "POST /uploadS3": {
        function: {
          handler: "packages/functions/src/s3Upload.uploadToS3",
          permissions: "*",
          bind: [documentsQueue],
          timeout: "300 seconds",
        },
      },
      "POST /splitPdf": {
        function: {
          handler: "packages/functions/src/splitPdf.handler",
          permissions: ["s3", "dynamodb"],
          timeout: "900 seconds",
          retryAttempts: 2,
        },
      },
      "POST /comprehend": {
        function: {
          handler: "packages/functions/src/comprehend.comprehendText",
          permissions: ["comprehend"],
          timeout: "900 seconds",

        },
      },
      "GET /downloadFile": {
        function: {
          handler: "packages/functions/src/files/downloadFile.main",
          permissions: "*",
          timeout: "900 seconds",

        },
      },

      "POST /textract": {
        function: {
          handler: "packages/functions/src/textractPdf.extractTextFromPDF",
          permissions: ["textract", "s3"],
          timeout: "200 seconds",
          bind: [documentsQueue],
          retryAttempts: 2,
        },
      },
      "GET /detectFileType": {
        function: {
          handler: "packages/functions/detectFileType.detect",
          permissions: ["s3"],
          timeout: "900 seconds",
        },
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
        },
      },
      "GET /viewFile": {
        function: {
          handler: "packages/functions/src/viewLogo.main", // Replace with your location
          permissions: ["s3"], // Grant necessary S3 permissions
        },
      },
      // Add the new route for retrieving files
      "GET /files": {
        function: {
          handler: "packages/functions/src/retrieveS3.main", // Replace with your location
          permissions: ["s3"], // Grant necessary S3 permissions
        },
      },

      // Add the new route for retrieving files
      "GET /count": {
        function: {
          handler: "packages/functions/src/filesCount.main", // Replace with your location
          permissions: ["s3"], // Grant necessary S3 permissions
        },
      },


      // Add the new route for deleting files
      "DELETE /deleteFile": {
        function: {
          handler: "packages/functions/src/deleteS3.main", // Replace with your actual handler location
          permissions: ["s3"],
        },
      },

      "POST /createUser": {
        function: {
          handler: "packages/functions/createUser.createUserInCognito",
          permissions: "*",
          //permissions wil be changed
        },
      },
      "POST /createFileDB": {
        function: {
          handler: "packages/functions/src/files/create.main",
          permissions: "*",
          timeout: "900 seconds",

        },
      },


      "PUT /fileSummary/{fileName}": {
        function: {
          handler: "packages/functions/src/files/update.main",
          permissions: "*",
          timeout: "900 seconds",

        },
      },

      "GET /summarization/{fileName}":
        "packages/functions/src/files/retrieveSummarization.main",

      //Uploading logo to S3
      "POST /uploadLogo": {
        function: {
          handler: "packages/functions/src/uploadLogo.uploadLogoToS3",
          permissions: "*",
        },
      },

      "POST /addUniDB": {
        function: {
          handler: "packages/functions/createUserDB.main",
          permissions: "*",
        },
      },

      "PUT /updateStatus/{uniName}": {
        function: {
          handler: "packages/functions/src/universities/updateStatus.main",
          permissions: "*",
        },
      },
      
      "GET /uniStatus/{uniName}": {
        function: {
          handler: "packages/functions/src/universities/getUniStatus.main",
          permissions: "*",
        },
      },
      //list universities with their status from the dynamoDB
      "GET /listUni": {
        function: {
          handler: "packages/functions/src/universities/listUnis.main",
          permissions: "*",
        },
      },
      //Fetching all users in cognito
      "GET /getUsers": {
        function: {
          handler: "packages/functions/src/fetchUsers.getUsers", // Replace with your location
          permissions: [
            "cognito-idp:ListUsers", // Add any additional permissions if required
          ],
        },
      },
      // Standard API route
      "POST /standards": "packages/functions/src/standards/create.main",
      "GET /standards/{id}": "packages/functions/src/standards/get.main",
      "GET /standards": "packages/functions/src/standards/list.main",
      "PUT /standards/{id}": "packages/functions/src/standards/update.main",
      "DELETE /standards/{id}": "packages/functions/src/standards/delete.main",

      "POST /criteria": "packages/functions/src/criteria/create.main",
      "GET /criteria/{id}": "packages/functions/src/criteria/get.main",
      "GET /criteria": "packages/functions/src/criteria/list.main",
      "GET /criteria/{id}/{indicator}": "packages/functions/src/criteria/getByIndicator.main",



    },


  });
  const get_users_function = api.getFunction("POST /createUser");
  get_users_function?.role?.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser")
  );

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

    // Show the API endpoint in the output
    stack.addOutputs({
      ApiEndpoint: api.url,
    });


  return { api, apiCachePolicy };
}
