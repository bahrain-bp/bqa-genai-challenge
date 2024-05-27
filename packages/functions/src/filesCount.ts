import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();
//const bucketName = "uni-artifacts"; // Your S3 bucket name

export async function main(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      const bucketName = event.headers["bucket-name"];
      const folderName = event.headers["folder-name"];
    //   const subfolderName = event.headers["subfolder-name"];
  
      if (!bucketName || !folderName) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Bucket name and folder name are required",
          }),
        };
      }
  
     
    // Fetch all objects in the user folder
    const prefix = `${folderName}/`;
    const params = {
        Bucket: bucketName,
        Prefix: prefix,
        Delimiter: '/'
    };
    const listResponse = await s3.listObjectsV2(params).promise();
    const fileCounts: { [key: string]: number } = {};  // Define with an index signature

    if (listResponse.CommonPrefixes) {
        for (const commonPrefix of listResponse.CommonPrefixes) {
            const standardPrefix = commonPrefix.Prefix!;
            const standardFilesResponse = await s3.listObjectsV2({
                Bucket: bucketName,
                Prefix: standardPrefix
            }).promise();

              // Filter out files containing "-split" in their name
              const filteredFiles = standardFilesResponse.Contents?.filter(
                content => content.Key && !content.Key.includes('-split') && !content.Key.endsWith('/')
            ) || [];

            const fileCount = filteredFiles.length;
            const standardName = standardPrefix.replace(prefix, '').replace('/', '');
            fileCounts[standardName] = fileCount;
        }
    }
        

        return {
            statusCode: 200,
            body: JSON.stringify(fileCounts),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, OPTIONS"
            }
        };



} catch (error) {
    console.error("Error fetching file counts:", error);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to fetch file counts", error })
    };
    
 
}

}
  