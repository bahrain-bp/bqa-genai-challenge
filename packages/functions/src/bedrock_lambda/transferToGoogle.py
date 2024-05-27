import boto3
import os
import base64
import json
from google.cloud import storage
from google.oauth2 import service_account

def handler(event, context):
    # Define AWS and Google Cloud clients
    s3_client = boto3.client('s3')
    decodedData = base64.b64decode(event['body']).decode('utf-8')
    print(decodedData)  # Print decoded data to check its structure
    decodedData_json = json.loads(decodedData)
    # Service account key as a dictionary
    service_account_key = {
         "type": "service_account",
  "project_id": "vertex-2-424221",
  "private_key_id": "94a60e9147807597979a3f4931aac458e15aa69f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmLsPoqrjb1yd6\nsu5ay2QVzGxZrbcEln2oIzYqbtvqoKp54Jb7Rer/WCoMhIzPLQJ9/vqdOKyAZh0g\n6NVrhYKq3ga7AzN2C2Zba3Z9wP7cE05FfNCi/3oE2SbHFmUOwHmEmoo48Q3pJT5U\nIuacnsb9jelAFJaz40O5Z0P+1DxnLwjxjZzKLI+8MtDplmoOUdDO1K+OaJzwmt52\noOD58BCqGjvxOv0j1YGw3EqMD6W9bu4P7KwSwAh9KietA+iIhUA0JKPFJtrZtZD/\nQvekDZxizQJuxSYglZj9I/Zm3ZQ4dmBMBaD3vpVra72UjL/o8D2qFAVCHc+uoM24\nsxqTCFxTAgMBAAECggEAGUb2vJ6vNJ1C34p07/GM/TXVa0SdmICNh3QnqoenQsaC\nd7xeKsVFS+asqq/EvUSS4vhURXLX5kXh+13/DHZH3FaePnbrrnJodNJhORqQiYgU\nOUSVdZ2XgUJIgDLbV0WWlkFtceDUpVhpZSHT4xHRocKiroETNTSF2h8nfAzrTSRe\nxn0I7k7T8Icob3atmtefMZbrgkrl/6Ep5/Exyg2uf29v8YZmTML2CtvmcTlexHi2\n98Xfa19qZl3eUlQIu9vRxQA3IlCP92F6BMV3tzhODB6Zz4L6AXbPZhAnys9SclBD\nJfUIQYQt5ggMwrSIuOoUIM8XuxRUsb31XCpagPeIeQKBgQDlPESlKMrZ82Q69o/p\nM080GYR14dyk6zC6BhGaaPkONq33OhFttyikkg2HJw7nsU1lI6GWkgzI2r8mVLjd\nHf8geT49L0pnrNYXV/pzo6z1wGyFh8xy7MkZahdIGD2GTsTQTtTOe/GsNuqDRzhh\n43WIdh2Xz9d0whWIYeYk9T+IGQKBgQC5leHVvFO/BTgBupn/8yGvYrvJhSRM6Jv8\n8JOLqsz0rtMSeMZO3xb7dD/d9U8EmMxuD6WrHQLdfNcG8DMIB2uD5yyb3BFR1IGn\nE5sKoPWrl7cs8R7zhYu8Ear0uZvf5u1zh2nan4l86ouOiqx0YMEcZEaJvggpb18V\nkcV0zjsFSwKBgG6uUcqYzpC7VsqtX8DOGFDkfTNZsWojcKxw37D5PD9joU18SQv7\nYnFLX6LA9g5iaicKNCv6KpgUHjUItRV2NUfdonJyUe+K4Pf2b6PEBG/Hz94NOmbG\n8zYFJmaV5abig168oT1tVLu87DAkhBGnfIk91n4FSVdDmpf2BOQVUe6JAoGBALKF\nLSJu8Jg1qvRuzajZ9jNB5KYrPwoET9j2ite1S0arzTpdl1VTYEYuQyl9ya8AVNYi\nkxiQ5aqtZiK0eEJm8NOHUu/yt25h3v4a6+9Dek6/uGKw5zcV5Z7Z1/tleD3fY9bY\nEclN4fGZpPlPCClC0UBAbWIevLcu/OZAvRJpN3kVAoGBAJp8CreXSF8ofdPvwhbP\nPm1WkfBZ4aOHgwPv0YH1RaYiA6/j4JzNcEuZuMaL+lGu1yWpq/2+3wPXCRy9uxFB\niU15Tt4fCcqYdxeNw3G3dJO6d+HiOICmPBC96FhZlFs/Snsvlh8Gcz3E/4KpUyGL\nHCSKzYfsD4GDjw1YABRWwNcp\n-----END PRIVATE KEY-----\n",
  "client_email": "vertex-2-424221@appspot.gserviceaccount.com",
  "client_id": "114558191308528136026",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vertex-2-424221%40appspot.gserviceaccount.com",
  "universe_domain": "googleapis.com"
    }
    credentials2 = credentials = service_account.Credentials.from_service_account_info(service_account_key)
    # Assuming service_account_key is set later
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