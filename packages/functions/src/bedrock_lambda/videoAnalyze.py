import base64
import json
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account
import boto3

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

    # Decrypts secret using the associated KMS key
    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)

def handler(event, context):
    # Extract the Cloud Storage URI from the request
    cloud_storage_uri = event['body']
    cloud_storage_uri2 = base64.b64decode(cloud_storage_uri).decode('utf-8')
    cloud_storage_uri2 = json.loads(cloud_storage_uri2)['body']

    # Create the JSON request payload with the Cloud Storage URI
    request_payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "fileData": {
                            "mimeType": "video/mp4",
                            "fileUri": cloud_storage_uri2
                        }
                    },
                    {
                        "text": "Describe this video? rate it out of 10"
                    }
                ]
            }
        ],
        "generationConfig": {
            "maxOutputTokens": 8192,
            "temperature": 1,
            "topP": 0.95
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    }

    # Set the API endpoint and headers with OAuth
    API_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/projects/vertex-2-424221/locations/us-central1/publishers/google/models/gemini-1.5-flash-preview-0514:streamGenerateContent"
    headers = {
        "Authorization": f"Bearer {get_access_token()}",
        "Content-Type": "application/json"
    }

    # Set the timeout for the request (in seconds)
    timeout_seconds = 900  # 15 minutes

    # Send the request to the API with timeout
    response = requests.post(API_ENDPOINT, headers=headers, json=request_payload, timeout=timeout_seconds)
    response_json = response.json() 
    #Merge all candidates in response
    merged_text = merge_text(response_json)
    print(merged_text)

    return {
        'statusCode': response.status_code,
        'body': merged_text
    }

def merge_text(response_json):
    merged_text = ""
    for item in response_json:
        candidates = item.get('candidates', [])
        for candidate in candidates:
            content = candidate.get('content', {})
            parts = content.get('parts', [])
            for part in parts:
                text = part.get('text', '')
                merged_text += text
    return merged_text

def get_access_token():
    service_account_key = get_secret()

    # Load the service account info from the key string
    credentials = service_account.Credentials.from_service_account_info(
        service_account_key,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    # Refresh the token
    credentials.refresh(Request())
    return credentials.token
