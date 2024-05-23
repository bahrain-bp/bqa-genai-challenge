import { Bucket, Table, StackContext, RDS } from "sst/constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsManager from "aws-cdk-lib/aws-secretsmanager";
import * as path from 'path';
import { Fn } from "aws-cdk-lib";
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export function DBStack({ stack, app }: StackContext) {

    // Create an S3 bucket
    const bucket = new Bucket(stack, "bqa-standards-evidence-bucket");

    const myBucket = new s3.Bucket(stack, 'bqa-standards-evidence-bucket-updated');
    new cloudfront.Distribution(stack, 'standards-dis', {
        defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    });

    // // Create a DynamoDB table
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
            standardId: "string",
            standardName: "string",   // Attribute for standards
            indicatorId: "string",
            indicatorName: "string",
            status: "string",        // Attribute for status
            description: "string",
            documentName: "string",
            documentURL: "string"
        },
        primaryIndex: { partitionKey: "entityType", sortKey: "entityId" },
    });
    const fileTable = new Table(stack, "FileTable", {
        fields: {
            fileName: "string",
            fileURL: "string",
            standardName: "string",
            indicatorName: "string",
            standardNumber: "number",
            indicatorNumber: "number",
            name: "string", // Standard name indicator
            content: "string",
            summary: "string",
            strength: "string",
            weakness: "string",
            score: "number",
            comments: "string"
        },
        primaryIndex: { partitionKey: "fileName" } // Assuming fileURL is unique
    });

    const criteriaTable = new Table(stack, "CriteriaTable", {

        fields: {
            standardId: "string",        // Standard ID
            standardName: "string",      // Standard Name
            indicators: "list",          // List of indicators
        },
        primaryIndex: { partitionKey: "standardId" },
    });


    const comparisonResultTable = new Table(stack, "ComparisonResult_Table", {
        fields: {
            comparisonId: "number", // Unique comparison ID

            standardNumber: "string",
            standardName: "string",
            indicatorNumber: "number",
            indicatorName: "string",
            comment: "string", // ID of the comment being evaluated
            outputText: "string", // Result of the comparison
            timestamp: "string", // Timestamp of when the comparison was made
        },
        primaryIndex: { partitionKey: "comparisonId" } // Assuming comparisonId is unique
    });




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

    return {
        bucket,
        table,
        fileTable,
        criteriaTable,
        comparisonResultTable

    };
}
