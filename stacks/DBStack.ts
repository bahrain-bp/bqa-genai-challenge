import { Table, StackContext, RDS } from "sst/constructs";

import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as path from 'path';
import { Role, PolicyStatement, Effect, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export function DBStack({ stack, app }: StackContext) {

    // Create a DynamoDB table
    // const table = new Table(stack, "Counter", {
    //     fields: {
    //     counter: "string",
    //     },
    //     primaryIndex: { partitionKey: "counter" },
    // });

    // Create the DynamoDB table
    const table = new Table(stack, "BQA", {
        fields: {
            entityType: "string",
            entityId: "string",
            username: "string",       // Attribute for users
            email: "string",          // Attribute for users
            standardName: "string",   // Attribute for standards
            description: "string",    // Attribute for standards, indicators, and documents
            documentName: "string",   // Attribute for documents
            documentURL: "string",    // Attribute for documents
            dateCreated: "string",    // Attribute for documents
            status: "string",          //Attribute for standards
        },
        primaryIndex: { partitionKey: "entityType", sortKey: "entityId" },
    });

    // // Define IAM policy statement for DynamoDB GetItem action
    // const dynamoDbGetItemPolicyStatement = new PolicyStatement({
    //     actions: ["dynamodb:GetItem"],
    //     resources: [table.tableArn],
    //     effect: Effect.ALLOW,
    // });

    // // Create an IAM role for Lambda function
    // const lambdaRole = new Role(stack, "LambdaRole", {
    //     assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    // });

    // // Attach the DynamoDB GetItem policy statement to the Lambda role
    // lambdaRole.addToPolicy(dynamoDbGetItemPolicyStatement);



    // Create an RDS database
    const mainDBLogicalName = "MainDatabase";
    // Define output/export attributes names
    const dbSecretArnOutputName = "DBSecretArn";
    const dbClusterIdentifierOutputName = "DBClusterIdentifier";
    // create db variable that will hold the RDS db construct
    var db: RDS

    // if (app.stage == "prod") {
    //     db = new RDS(stack, mainDBLogicalName, {
    //         engine: "mysql5.7",
    //         defaultDatabaseName: "maindb",
    //         migrations: [".","packages","db-migrations"].join(path.sep),
    //     });

    //     // Export db secret arn and cluster identifier to be used by other stages
    //     stack.addOutputs({
    //         [dbSecretArnOutputName] : {
    //             value: db.secretArn,
    //             exportName: dbSecretArnOutputName,
    //         },
    //         [dbClusterIdentifierOutputName] : {
    //             value: db.clusterIdentifier,
    //             exportName: dbClusterIdentifierOutputName,
    //         },
    //     });
    // } else {
    //     // Import the existing secret from the exported value
    //     const existing_secret = secretsManager.Secret.fromSecretCompleteArn(stack, "ExistingSecret", Fn.importValue(dbSecretArnOutputName));
    //     // Create an SST resource for the existing DB (does not create a new DB, references the existing one)
    //     db = new RDS(stack, "ExistingDatabase", {
    //         engine: "mysql5.7",
    //         defaultDatabaseName: "maindb",
    //         migrations: [".","packages","db-migrations"].join(path.sep),
    //         cdk: {
    //             cluster: rds.ServerlessCluster.fromServerlessClusterAttributes(stack, "ExistingCluster", {
    //                 // Import the existing cluster identifier from the exported value
    //                 clusterIdentifier: Fn.importValue(dbClusterIdentifierOutputName),
    //                 secret: existing_secret,
    //             }),
    //             secret: existing_secret,
    //         },
    //     });
    // }

    return { table };
}
