import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { AuthStack } from "./AuthStack";

export function ApiStack({ stack }: StackContext) {
    const { auth }=use(AuthStack);
    const {table} = use(DBStack);
    const api = new Api(stack, "signinAPI", {
        authorizers: {
          jwt: {
            type: "user_pool",
            userPool: {
              id: auth.userPoolId,
              clientIds: [auth.userPoolClientId],
            },
          },
        },
        defaults: {
            function: {
                // Bind the table name to our API
                bind: [table],
            },

          authorizer: "jwt",
        },
        routes: {

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
          // Sample TypeScript lambda function
          "POST /": "packages/functions/src/lambda.main",

            // Sample Pyhton lambda function
            "GET /": {
                function: {
                    handler: "packages/functions/src/sample-python-lambda/lambda.main",
                    runtime: "python3.11",
                    timeout: "60 seconds",
                }
            },

            
        }
        
    });
    




         
        }
      });
    
 
    // cache policy to use with cloudfront as reverse proxy to avoid cors
    // https://dev.to/larswww/real-world-serverless-part-3-cloudfront-reverse-proxy-no-cors-cgj
    const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
        minTtl: Duration.seconds(0), // no cache by default unless backend decides otherwise
        defaultTtl: Duration.seconds(0),
        headerBehavior: CacheHeaderBehavior.allowList(
        "Accept",
        "Authorization",
        "Content-Type",
        "Referer"
        ),
    });

    return {api, apiCachePolicy}
}
