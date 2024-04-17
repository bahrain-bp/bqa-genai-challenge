import { Api, StackContext, use } from "sst/constructs";
import { DBStack } from "./DBStack";

export function StandardAPIStack({ stack }: StackContext) {
    const { table } = use(DBStack);

    // Create the API
    const api = new Api(stack, "StandardsApi", {
        defaults: {
            function: {
                bind: [table],
            },
        },
        routes: {
            "POST /standards": "packages/functions/src/standards/create.main",
            "GET /standards/{id}": "packages/functions/src/standards/get.main",
            "GET /standards": "packages/functions/src/standards/list.main",
            "GET /calcIndicators": {
                function: {
                  handler: "packages/functions/src/standards/calcIndicators.main",
                  permissions: ["dynamodb"],
                }
              },            "PUT /standards/{id}": "packages/functions/src/standards/update.main",
            "DELETE /standards/{id}": "packages/functions/src/standards/delete.main",
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