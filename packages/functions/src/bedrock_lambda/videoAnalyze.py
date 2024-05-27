import base64
import json
import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

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
                        "text": "Describe the video? what is in it?"
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

    # Set the API endpoint and headers
    API_ENDPOINT = "https://us-central1-aiplatform.googleapis.com/v1/projects/vertex-2-424221/locations/us-central1/publishers/google/models/gemini-1.5-flash-preview-0514:streamGenerateContent"
    headers = {
        "Authorization": f"Bearer {get_access_token()}",
        "Content-Type": "application/json"
    }

    # Set the timeout for the request (in seconds)
    timeout_seconds = 900  # 15 minutes

    # Send the request to the API with the specified timeout
    response = requests.post(API_ENDPOINT, headers=headers, json=request_payload, timeout=timeout_seconds)
    response_json = response.json()  # Parse the response content as JSON
    merged_text = merge_text(response_json)

    print(merged_text)

    # Return the API response
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
    # Service account key as a string
    service_account_key = {
        "type": "service_account",
        "project_id": "vertex-2-424221",
        "private_key_id": "df2e2ec9ce86b1828afd3db74079f92b215af6b2",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJ+VV17fZACMuH\nO7/AapOopVd7ZN+uH4Vh+G+Dfks3qulDL9cDDRYWO2n/T5rg2kLxaOsqiEcV2+wy\nGdziQM+31L7Dlk/H9ojj8T9uZHmpDRIGWvzrjOlUGJlA6o9QKcQW+U8dUo7s3UmO\na8e7KiUIOcxX6M4GjIf/ph0oJasThRyDZW57fc8lMdh0SYYGqcSQ15Vaeauqd+BK\nBRp0sms2T/UaclnJCVwgm+9BB7kKcXX/785k6ZDvRxJwiLQ9JQd7OKaUL/klY6P2\n8L5RPcApqJ8t0PrgyjwZjTUpfeN/rY+tMVB/aQfZiQAfvRFVGGmn8RFxqsVvITFg\nEVaz4KjDAgMBAAECggEAEbQdthMQKSe8M1Pc6HBPFhK8GtBKPPh9WAuPNr7st+nu\nvVllptpQS82UanEfWcM35/Iy3s0IMhXPW8rhjiFxM6Ndv0YfIx9se1JrpXEAKv2+\nzTjPf5Qf5aOsV0DYJAYtLnhW43KXnZJ9/pJa9QBqM5DhZPk+idtqllGIr7qxhqnV\n0p4oBpD1lq3WXHEyHXlIjC4XeMxFnd75jNigqHVI3a2TO8MgeZr+D/Yt7mAiVM7k\nzSX+Btp6h1hDbv987dVtNCGgaLuMp+fkcHJm6pUdhTB4CTUAxXMoK9ZMi9pVOlbL\ns3nr/dHqftgbJEkVwLdpQqg2rz4wAHQzwSzHiRqXDQKBgQDz2e+35JHD08VMqcp5\nN5w3VPw4uyabAgTdjrejtNKclOn2Ut6hNfSMUOXjbYjLe1uOgfi/WyFW7hTrk7Dm\nX1qBFlSg0xRHxNzOyQ5hbzi4b2MxV3PBrDSQOLXFquZID+Nc05PST/CSSP5fJ1S/\nqfFFJwIFNDiH8LJSGDcBF+oeZwKBgQDUCUviGMLQtbJ3O//LPz+NTWMCS5l1UpHU\nl92yPTbN/GbHcBp5GsJLGcnh0mD4s90JBl0PC4rMw1PaM0dw73Ht6h+abWVXKJLw\nWS+ChKfoipDHALiJbGHnjNx/r9daV78ORdtIaGIkBcN4pPkP9544OGgMEE7pe9ba\nlakl8+1xRQKBgAXuVRBJ9OmoavIUZyJPofMOlBvlIWk/wVKKOBk5Oq4oSRB+r3+I\nSmxnQ1Amx977Hxz2OFCfLM5qeAPK0dConRDqtCA9Qg8E0MIOzdS82cpSmz0F/YDG\naXjgiDtIjtVN3Z/SXZQN8bH9KIKz+DG5Nm8SJdBulrlnt06b3CqgpEcdAoGATb1K\n0Q56/sJfOFALLJ1303q3/jNxhA5N4T/8zEidO1B67kwvqI8jBR3jYqQbYZOwSorG\nu6ljrkc/CxUZ8FIZ1zyrcZcCPL5ngS9xt8yjMyL6ibu97MSL8LU4cqgpsLnTFoyO\nJTIAKWzjiewSVMRYggxMOYARLpF06JdOeNfCCnECgYEArJGeynHgD3TRmfsu1fbM\nw51QCyNVywTjlVBQhpcmJ4lAjO2BVFk5C8X8QH2GtTCIUYc1F2hmSKFy03Jt//et\nfmW5SQhmEjrLoeGLVswGyFK79WfLmRN9qZWOQgEsbzhMgbUJ5Mj05iIj+4llJ1u5\nATdWxEToyhkEy7GPGyMFMuY=\n-----END PRIVATE KEY-----\n",
        "client_email": "vertex-2-424221@appspot.gserviceaccount.com",
        "client_id": "114558191308528136026",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vertex-2-424221%40appspot.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    }

    # Load the service account info from the key string
    credentials = service_account.Credentials.from_service_account_info(
        service_account_key,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    # Refresh the token
    credentials.refresh(Request())
    return credentials.token
