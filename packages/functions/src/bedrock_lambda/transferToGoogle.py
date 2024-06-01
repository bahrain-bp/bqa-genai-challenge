import boto3
import os
import base64
import json
from google.cloud import storage
from google.oauth2 import service_account

def get_secret():
    secret_name = "vertex-service-account"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except Exception as e:
        print(f"Error retrieving secret: {e}")
        raise e

    # Decrypts secret 
    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)

def handler(event, context):
    
    # Define AWS and Google Cloud clients
    s3_client = boto3.client('s3')
    decodedData = base64.b64decode(event['body']).decode('utf-8')
    print(decodedData) 
    decodedData_json = json.loads(decodedData)

    # Retrieve the service account key from Secrets Manager
    service_account_key = get_secret()

    # Initialize Google Cloud Storage client
    credentials = service_account.Credentials.from_service_account_info(service_account_key)
    gcs_client = storage.Client(credentials=credentials)

    # S3 bucket and object details
    s3_bucket = decodedData_json['Records'][0]['s3']['bucket']['name']
    s3_key = decodedData_json['Records'][0]['s3']['object']['key']

    # Local file path 
    local_file_path = '/tmp/' + os.path.basename(s3_key)

    # Download the file from S3
    s3_client.download_file(s3_bucket, s3_key, local_file_path)

    # GCS bucket details
    gcs_bucket_name = 'gcf-v2-sources-568339039572-us-central1'
    gcs_blob_name = s3_key

    # Upload the file to GCS
    gcs_bucket = gcs_client.bucket(gcs_bucket_name)
    gcs_blob = gcs_bucket.blob(gcs_blob_name)
    gcs_blob.upload_from_filename(local_file_path)

    bucketurl = 'gs://gcf-v2-sources-568339039572-us-central1/' + s3_key
    return {
        'statusCode': 200,
        'body': bucketurl
    }
