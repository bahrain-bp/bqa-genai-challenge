import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// stacks/AuthStack.ts
import { Cognito } from "sst/constructs";
function AuthStack({ stack, app }) {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"]
  });
  return { auth };
}
__name(AuthStack, "AuthStack");

// stacks/ApiStack.ts
import { Api as Api2, use } from "sst/constructs";

// stacks/DBStack.ts
import { Bucket, Table } from "sst/constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
function DBStack({ stack, app }) {
  const bucket = new Bucket(stack, "bqa-standards-evidence-bucket");
  const myBucket = new s3.Bucket(stack, "bqa-standards-evidence-bucket-updated");
  new cloudfront.Distribution(stack, "standards-dis", {
    defaultBehavior: { origin: new origins.S3Origin(myBucket) }
  });
  const table = new Table(stack, "BQA", {
    fields: {
      entityType: "string",
      entityId: "string",
      standardId: "string",
      standardName: "string",
      // Attribute for standards
      indicatorId: "string",
      indicatorName: "string",
      status: "string",
      // Attribute for status
      description: "string",
      documentName: "string",
      documentURL: "string"
    },
    primaryIndex: { partitionKey: "entityType", sortKey: "entityId" }
  });
  const mainDBLogicalName = "MainDatabase";
  const dbSecretArnOutputName = "DBSecretArn";
  const dbClusterIdentifierOutputName = "DBClusterIdentifier";
  var db;
  return {
    bucket,
    table
  };
}
__name(DBStack, "DBStack");

// stacks/ApiStack.ts
import { CacheHeaderBehavior, CachePolicy } from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";

// stacks/S3Stack.ts
import { aws_iam as iam } from "aws-cdk-lib";
import { Queue, Function } from "sst/constructs";
import * as AWS from "aws-sdk";
function S3Stack({ stack, app }) {
  const bucketName = "uni-artifacts";
  createS3Bucket(stack, bucketName).then(() => configureBucketPolicy(stack, bucketName, "us-east-1_QmBzINJmW")).catch((error) => console.error("Error:", error));
  async function createS3Bucket(stack2, bucketName2) {
    const s32 = new AWS.S3();
    try {
      await s32.headBucket({ Bucket: bucketName2 }).promise();
      console.log(`Bucket "${bucketName2}" already exists.`);
    } catch (error) {
      try {
        await s32.createBucket({ Bucket: bucketName2 }).promise();
        console.log(`Bucket "${bucketName2}" created successfully.`);
      } catch (error2) {
        console.error("Error creating bucket: ", error2);
      }
    }
  }
  __name(createS3Bucket, "createS3Bucket");
  const handler = "packages/functions/src/bedrock_lambda/bedrock_prompt.handler";
  const bedrock_lambda = new Function(stack, "bedrock_lambda", {
    handler,
    permissions: "*",
    timeout: "300 seconds"
  });
  bedrock_lambda.role?.addManagedPolicy(
    iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
  );
  const documentsQueue = new Queue(stack, "Document-Queue", {
    consumer: {
      function: bedrock_lambda
    },
    cdk: {
      queue: {
        fifo: true,
        // contentBasedDeduplication: true,
        queueName: stack.stage + "-documents-queue.fifo",
        contentBasedDeduplication: true
      }
    }
  });
  documentsQueue.attachPermissions("*");
  bedrock_lambda.bind([documentsQueue]);
  const textractQueue = new Queue(stack, "textract-Queue", {
    consumer: {
      function: bedrock_lambda
    },
    cdk: {
      queue: {
        fifo: true,
        // contentBasedDeduplication: true,
        queueName: stack.stage + "-textract-queue.fifo",
        contentBasedDeduplication: true
      }
    }
  });
  textractQueue.attachPermissions("*");
  async function configureBucketPolicy(stack2, bucketName2, cognitoPoolId) {
  }
  __name(configureBucketPolicy, "configureBucketPolicy");
  return { documentsQueue };
}
__name(S3Stack, "S3Stack");

// stacks/ApiStack.ts
import * as iam2 from "@aws-cdk/aws-iam";
function ApiStack({ stack }) {
  const { auth } = use(AuthStack);
  const { table } = use(DBStack);
  const { documentsQueue } = use(S3Stack);
  const api = new Api2(stack, "signinAPI", {
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
        bind: [table]
        // Bind the table name to our API
      }
      // Optional: Remove authorizer from defaults if set to "jwt"
      // authorizer: "jwt",
    },
    routes: {
      // Sample TypeScript lambda function
      "POST /": "packages/functions/src/lambda.main",
      "POST /uploadS3": {
        function: {
          handler: "packages/functions/src/s3Upload.uploadToS3",
          permissions: "*",
          bind: [documentsQueue]
        }
      },
      "POST /comprehend": {
        function: {
          handler: "packages/functions/src/comprehend.comprehendText",
          permissions: ["comprehend"]
        }
      },
      "POST /textract": {
        function: {
          handler: "packages/functions/src/textractPdf.extractTextFromPDF",
          permissions: ["textract", "s3"],
          timeout: "200 seconds",
          bind: [documentsQueue]
        }
      },
      "GET /detectFileType": {
        function: {
          handler: "packages/functions/detectFileType.detect",
          permissions: ["s3"]
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
          timeout: "60 seconds"
        }
      },
      // Add the new route for retrieving files
      "GET /files": {
        function: {
          handler: "packages/functions/src/retrieveS3.main",
          // Replace with your location
          permissions: ["s3"]
          // Grant necessary S3 permissions
        }
      },
      "POST /createUser": {
        function: {
          handler: "packages/functions/createUser.createUserInCognito",
          permissions: "*"
          //permissions wil be changed
        }
      },
      //Uploading logo to S3
      /*
      "POST /uploadLogo": {
        function: {
          handler: "packages/functions/uploadLogo.uploadLogo",
          permissions: "*"
        }
      },
      */
      //Fetching all users in cognito
      "GET /getUsers": {
        function: {
          handler: "packages/functions/src/fetchUsers.getUsers",
          // Replace with your location
          permissions: [
            "cognito-idp:ListUsers"
            // Add any additional permissions if required
          ]
        }
      }
    }
  });
  const get_users_function = api.getFunction("POST /createUser");
  get_users_function?.role?.addManagedPolicy(
    iam2.ManagedPolicy.fromAwsManagedPolicyName("AmazonCognitoPowerUser")
  );
  const apiCachePolicy = new CachePolicy(stack, "CachePolicy", {
    minTtl: Duration.seconds(0),
    // No cache by default unless backend decides otherwise
    defaultTtl: Duration.seconds(0),
    headerBehavior: CacheHeaderBehavior.allowList(
      "Accept",
      "Authorization",
      "Content-Type",
      "Referer"
    )
  });
  return { api, apiCachePolicy };
}
__name(ApiStack, "ApiStack");

// stacks/FrontendStack.ts
import { Fn } from "aws-cdk-lib";
import {
  AllowedMethods,
  OriginProtocolPolicy,
  OriginSslPolicy,
  ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { StaticSite as StaticSite2, use as use2 } from "sst/constructs";
function FrontendStack({ stack }) {
  const { api, apiCachePolicy } = use2(ApiStack);
  const site = new StaticSite2(stack, "ReactSite", {
    path: "packages/frontend",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: {
      VITE_API_URL: api.url
    },
    cdk: {
      distribution: {
        additionalBehaviors: {
          "/api/*": {
            origin: new HttpOrigin(Fn.parseDomainName(api.url), {
              originSslProtocols: [OriginSslPolicy.TLS_V1_2],
              protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
            }),
            viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
            cachePolicy: {
              cachePolicyId: apiCachePolicy.cachePolicyId
            },
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS
          }
        }
      }
    }
  });
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url
  });
}
__name(FrontendStack, "FrontendStack");

// stacks/StandardAPIStack.ts
import { Api as Api3, use as use3 } from "sst/constructs";
function StandardAPIStack({ stack }) {
  const { table } = use3(DBStack);
  const api = new Api3(stack, "StandardsApi", {
    defaults: {
      function: {
        bind: [table]
      }
    },
    routes: {
      "POST /standards": "packages/functions/src/standards/create.main",
      "GET /standards/{id}": "packages/functions/src/standards/get.main",
      "GET /standards": "packages/functions/src/standards/list.main",
      "PUT /standards/{id}": "packages/functions/src/standards/update.main",
      "DELETE /standards/{id}": "packages/functions/src/standards/delete.main"
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(StandardAPIStack, "StandardAPIStack");

// stacks/EmailAPIStack.ts
import { Api as Api4 } from "sst/constructs";
function EmailAPIStack({ stack }) {
  const api = new Api4(stack, "EmailsApi", {
    routes: {
      "POST /send-email": "packages/functions/src/send-email.sendEmail"
    }
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return {
    api
  };
}
__name(EmailAPIStack, "EmailAPIStack");

// stacks/devops/ImageBuilderForCodeCatalyst.ts
import path from "path";
import * as imagebuilder from "aws-cdk-lib/aws-imagebuilder";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam3 from "aws-cdk-lib/aws-iam";
var fs = __require("fs");
function ImageBuilderForCodeCatalyst({ stack, app }) {
  const gitComponenet = new imagebuilder.CfnComponent(stack, "GitComponenet", {
    name: app.logicalPrefixedName("Git"),
    platform: "Linux",
    version: "1.0.0",
    data: fs.readFileSync(
      path.resolve(".codecatalyst/imagebuilder/git.yaml"),
      "utf8"
    )
  });
  const nodejsComponenet = new imagebuilder.CfnComponent(stack, "NodejsComponenet", {
    name: app.logicalPrefixedName("Nodejs"),
    platform: "Linux",
    version: "1.0.0",
    data: fs.readFileSync(
      path.resolve(".codecatalyst/imagebuilder/node.yaml"),
      "utf8"
    )
  });
  const ecrRepoForImageBuilderCodeCatalyst = new ecr.Repository(stack, "EcrRepoForImageBuilderCodeCatalyst");
  const AmazonLinux2023wGitNodeRecipe = new imagebuilder.CfnContainerRecipe(stack, "AmazonLinux2023withGitAndNodeRecipe", {
    components: [
      {
        componentArn: gitComponenet.attrArn
      },
      {
        componentArn: nodejsComponenet.attrArn
      }
    ],
    containerType: "DOCKER",
    dockerfileTemplateData: "FROM {{{ imagebuilder:parentImage }}}\n{{{ imagebuilder:environments }}}\n{{{ imagebuilder:components }}}\n",
    name: app.logicalPrefixedName("AmazonLinux2023WithGit"),
    parentImage: `arn:aws:imagebuilder:${stack.region}:aws:image/amazon-linux-2023-x86-latest/x.x.x`,
    targetRepository: {
      repositoryName: ecrRepoForImageBuilderCodeCatalyst.repositoryName,
      service: "ECR"
    },
    version: "2.0.0"
  });
  const instanceProfileForImageBuilder = new iam3.InstanceProfile(stack, "InstanceProfileForImageBuilder", {
    role: new iam3.Role(stack, "EC2InstanceProfileForImageBuilder", {
      assumedBy: new iam3.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
        },
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilder"
        },
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/EC2InstanceProfileForImageBuilderECRContainerBuilds"
        }
      ]
    })
  });
  const infraConfig = new imagebuilder.CfnInfrastructureConfiguration(stack, "ImageBuilderInfraConfig", {
    name: app.logicalPrefixedName("infra"),
    instanceProfileName: instanceProfileForImageBuilder.instanceProfileName
  });
  const distConfig = new imagebuilder.CfnDistributionConfiguration(stack, "ImageBuilderDistConfig", {
    name: app.logicalPrefixedName("dist"),
    distributions: [
      {
        region: stack.region,
        containerDistributionConfiguration: {
          "TargetRepository": {
            "RepositoryName": ecrRepoForImageBuilderCodeCatalyst.repositoryName,
            "Service": "ECR"
          }
        }
      }
    ]
  });
  const imageBuilderPipeline = new imagebuilder.CfnImagePipeline(stack, "AmazonLinux2023WithGitPipeline", {
    name: app.logicalPrefixedName("AmazonLinux23WithGitPipeline"),
    infrastructureConfigurationArn: infraConfig.attrArn,
    distributionConfigurationArn: distConfig.attrArn,
    containerRecipeArn: AmazonLinux2023wGitNodeRecipe.attrArn,
    status: "ENABLED"
  });
}
__name(ImageBuilderForCodeCatalyst, "ImageBuilderForCodeCatalyst");

// stacks/devops/OIDCForGitHubCI.ts
import { Duration as Duration2 } from "aws-cdk-lib";
import * as iam4 from "aws-cdk-lib/aws-iam";
function OIDCForGitHubCI({ stack }) {
  const provider = new iam4.OpenIdConnectProvider(stack, "GitHub", {
    url: "https://token.actions.githubusercontent.com",
    clientIds: ["sts.amazonaws.com"]
  });
  const organization = "bahrain-bp";
  const repository = "bqa-genai-challenge";
  new iam4.Role(stack, "GitHubActionsRole", {
    assumedBy: new iam4.OpenIdConnectPrincipal(provider).withConditions({
      StringLike: {
        "token.actions.githubusercontent.com:sub": `repo:${organization}/${repository}:*`
      }
    }),
    description: "Role assumed for deploying from GitHub CI using AWS CDK",
    roleName: "GitHub",
    // Change this to match the role name in the GitHub workflow file
    maxSessionDuration: Duration2.hours(1),
    inlinePolicies: {
      // You could attach AdministratorAccess here or constrain it even more, but this uses more granular permissions used by SST
      SSTDeploymentPolicy: new iam4.PolicyDocument({
        assignSids: true,
        statements: [
          new iam4.PolicyStatement({
            effect: iam4.Effect.ALLOW,
            actions: [
              "cloudformation:DeleteStack",
              "cloudformation:DescribeStackEvents",
              "cloudformation:DescribeStackResources",
              "cloudformation:DescribeStacks",
              "cloudformation:GetTemplate",
              "cloudformation:ListImports",
              "ecr:CreateRepository",
              "iam:PassRole",
              "iot:Connect",
              "iot:DescribeEndpoint",
              "iot:Publish",
              "iot:Receive",
              "iot:Subscribe",
              "lambda:GetFunction",
              "lambda:GetFunctionConfiguration",
              "lambda:UpdateFunctionConfiguration",
              "s3:ListBucket",
              "s3:PutObjectAcl",
              "s3:GetObject",
              "s3:PutObject",
              "s3:DeleteObject",
              "s3:ListObjectsV2",
              "s3:CreateBucket",
              "s3:PutBucketPolicy",
              "ssm:DeleteParameter",
              "ssm:GetParameter",
              "ssm:GetParameters",
              "ssm:GetParametersByPath",
              "ssm:PutParameter",
              "sts:AssumeRole"
            ],
            resources: [
              "*"
            ]
          })
        ]
      })
    }
  });
}
__name(OIDCForGitHubCI, "OIDCForGitHubCI");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "codecatalyst-sst-app",
      region: "us-east-1"
    };
  },
  stacks(app) {
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    if (app.stage == "devops-coca") {
      app.stack(ImageBuilderForCodeCatalyst);
    } else if (app.stage == "devops-gh") {
      app.stack(OIDCForGitHubCI);
    } else {
      app.stack(DBStack).stack(S3Stack).stack(AuthStack).stack(ApiStack).stack(StandardAPIStack).stack(EmailAPIStack).stack(FrontendStack);
    }
  }
};
export {
  sst_config_default as default
};
