import json
import logging
import boto3
import base64
import PyPDF2
from botocore.exceptions import ClientError
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ImageError(Exception):
    "Custom exception for errors returned by Amazon &titan-text-express; model"
    def __init__(self, message):
        self.message = message

def generate_text(model_id, body):
    """
    Generate text using Amazon &titan-text-express; model on demand.
    Args:
        model_id (str): The model ID to use.
        body (str) : The request body to use.
    Returns:
        response (json): The response from the model.
    """

    logger.info("Generating text with Amazon &titan-text-express; model %s", model_id)

    bedrock = boto3.client(service_name='bedrock-runtime')
    accept = "application/json"
    content_type = "application/json"

    response = bedrock.invoke_model(
        body=body, modelId=model_id, accept=accept, contentType=content_type
    )
    response_body = json.loads(response.get("body").read())

    finish_reason = response_body.get("error")

    if finish_reason is not None:
        raise ImageError(f"Text generation error. Error is {finish_reason}")

    logger.info("Successfully generated text with Amazon &titan-text-express; model %s", model_id)

    return response_body

def get_s3_object_content(bucket_name, key):
    """
    Retrieve content of an object from S3.
    Args:
        bucket_name (str): The name of the S3 bucket.
        key (str): The key of the object.
    Returns:
        str: The decoded content of the S3 object.
    """
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket_name, Key=key)
    
    # Read the content of the S3 object
    content_bytes = response['Body'].read()
    
    # Try decoding the content with UTF-8
    try:
        content_str = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        # If UTF-8 decoding fails, try other common encodings
        encodings = ['utf-8', 'latin-1', 'iso-8859-1']
        for encoding in encodings:
            try:
                content_str = content_bytes.decode(encoding)
                break
            except UnicodeDecodeError:
                continue
        else:
            # If all decoding attempts fail, raise an error
            raise UnicodeDecodeError("Failed to decode content with any encoding")
    
    # Find the start and end boundaries
    start_boundary = content_str.find('\n\r\n')
    end_boundary = content_str.find('\n--', start_boundary)
    
    # Extract the content between boundaries
    content = content_str[start_boundary + 3:end_boundary].strip()
    
    # Decode the extracted content if it appears to be encoded
    decoded_content = base64.b64decode(content)  # Example: If the content is Base64 encoded
    
    return decoded_content.decode('utf-8')  # Decode the content to UTF-8

def truncate_text(text, max_length):
    """
    Truncate text to a maximum length.
    Args:
        text (str): The text to truncate.
        max_length (int): The maximum length allowed.
    Returns:
        str: Truncated text.
    """
    if len(text) <= max_length:
        return text
    else:
        return text[:max_length]

def handler(event, context):
    """
    Entrypoint for Amazon &titan-text-express; example.
    """
    try:
        logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

        model_id = 'amazon.titan-text-express-v1'
        s3_uri = event['Records'][0]['body']
        parsed_s3_uri = urlparse(s3_uri)
        if not parsed_s3_uri.scheme or not parsed_s3_uri.netloc:
            raise ValueError("Invalid S3 URI format")

        bucket_name = 'uni-artifacts'
        key = parsed_s3_uri.path.lstrip('/')
        document_content = get_s3_object_content(bucket_name, key)

        # Truncate document content to a maximum length
        max_input_length = 80000  # Adjust according to your service's maximum limit
        truncated_content = truncate_text(document_content, max_input_length)
        print(document_content,"document_content")

        #prompt = f'Please provide a summary about the document at path: {s3_uri}'
        prompt = f'provide a summary about this content {document_content}'
        logger.info(prompt)

        body = json.dumps({
            "inputText": truncated_content,
            "textGenerationConfig": {
                "maxTokenCount": 4096,
                "stopSequences": [],
                "temperature": 0,
                "topP": 1
            }
        })

        response_body = generate_text(model_id, body)

        response = {"prompt": prompt, "results": response_body['results']}
        print(response)
        logger.info(response)

        return response  # Return the response JSON

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        return {"error": message}  # Return error message in case of ClientError

    except ImageError as err:
        logger.error(err.message)
        return {"error": err.message}  # Return error message in case of ImageError

    except Exception as e:
        logger.error("An unexpected error occurred: %s", str(e))
        return {"error": "An unexpected error occurred"}  # Return generic error message for other exceptions
