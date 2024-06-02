import * as AWS from "aws-sdk";
import { Buffer } from "buffer";

// Initialize the S3 service
const s3 = new AWS.S3();

async function createFolder(bucketName: string, folderPath: string) {
    try {
        // Check if the folder exists
        const params = {
            Bucket: bucketName,
            Prefix: folderPath,
            Delimiter: "/",
        };
        const data = await s3.listObjectsV2(params).promise();

        // If the folder doesn't exist, create it
        if (!data.CommonPrefixes?.length) {
            const folders = folderPath.split("/");
            let folderKey = "";
            for (const folder of folders) {
                folderKey += folder + "/";
                await s3.putObject({
                    Bucket: bucketName,
                    Key: folderKey,
                    Body: "",
                }).promise();
            }
        }
    } catch (error) {
        console.error("Error creating folder:", error);
        throw new Error("Failed to create folder");
    }
}

export async function uploadLogoToS3(event: any) {
    try {
        const fileData = Buffer.from(event.body, "base64");
        const fileName = event.headers["file-name"];
        const bucketName = event.headers["bucket-name"];
        const folderName = event.headers["folder-name"];
        const subfolderName = event.headers["subfolder-name"];
        const contentType = event.headers["content-type"];

        // Validate necessary information
        if (!fileName || !bucketName || !folderName) {
            throw new Error("Necessary information not provided");
        }

        // Combine folder and subfolder name if subfolder is provided
        const folderPath = subfolderName ? `${folderName}/${subfolderName}` : folderName;

        // Create folder if it doesn't exist
        await createFolder(bucketName, folderPath);

        // Upload the photo directly to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: `${folderPath}/${fileName}`,
            Body: fileData,
            ContentType: contentType,
        };

        const uploadResponse = await s3.upload(uploadParams).promise();
        console.log("Upload successful:", uploadResponse.Location);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Photo uploaded successfully",
                location: uploadResponse.Location,
            }),
        };
    } catch (error) {
        console.error("Error uploading photo:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to upload photo" }),
        };
    }
}
