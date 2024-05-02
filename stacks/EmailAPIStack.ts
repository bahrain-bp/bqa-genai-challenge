import { Api, StackContext } from "sst/constructs";

export function EmailAPIStack({ stack }: StackContext) {
    // Create the API
    const api = new Api(stack, "EmailsApi", {
        routes: {
            "POST /sesLambda": "packages/functions/src/sesLambda.sendEmail",
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
