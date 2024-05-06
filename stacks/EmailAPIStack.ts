import { Api, StackContext } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export function EmailAPIStack({ stack }: StackContext) {

    // // Define IAM policy for SES
    // const sesPolicy = new iam.Policy(stack, 'SESPermission', {
    //     statements: [
    //         new iam.PolicyStatement({
    //             actions: ['ses:SendEmail', 'ses:SendRawEmail'],
    //             effect: iam.Effect.ALLOW,
    //             resources: ['*'],
    //         }),
    //     ],
    // });

    // Create the API
    const api = new Api(stack, "EmailsApi", {
        routes: {
            "POST /send-email": {
                function: {
                  handler: "packages/functions/src/send-email.sendEmail",
                  permissions: ["ses"]
                }
              },
        },        
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}