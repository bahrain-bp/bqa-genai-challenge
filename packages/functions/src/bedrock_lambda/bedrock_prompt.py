import logging
import boto3
from botocore.exceptions import ClientError
from urllib.parse import urlparse
import mimetypes  # Import the mimetypes module for MIME type detection


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class TextractWrapper:
    """Encapsulates Textract functions."""

    def __init__(self, textract_client):
        """
        :param textract_client: A Boto3 Textract client.
        """
        self.textract_client = textract_client

    def analyze_document(self, bucket_name, key, region=None):
        """
        Analyzes a document stored in an S3 bucket using Textract.

        :param bucket_name: The name of the S3 bucket where the document is stored.
        :param key: The key of the document in the S3 bucket.
        :param region: The AWS region where the S3 bucket is located (optional).
        :return: The analysis results from Textract.
        """
        try:
            # If region is specified, use it; otherwise, let Textract client use default region
            if region:
                s3_client = boto3.client('s3', region_name=region)
            else:
                s3_client = boto3.client('s3')
            
            response = self.textract_client.analyze_document(
                Document={
                    'S3Object': {
                        'Bucket': "uni-artifacts",
                        'Name': key
                    }
                },
                FeatureTypes=['TABLES', 'FORMS']
            )
            logger.info("Textract analysis successful.")
            return response
        except ClientError as e:
            logger.error("Textract analysis failed: %s", e)
            raise

def handler(event, context):
    """
    Entrypoint for the function.
    """
    try:
        logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
        
        s3_uri = event['Records'][0]['body']
        parsed_s3_uri = urlparse(s3_uri)
        logger.info("Parsed S3 URI: %s", parsed_s3_uri)
        
        if not parsed_s3_uri.scheme or not parsed_s3_uri.hostname:
            raise ValueError("Invalid S3 URI format")

        bucket_name = parsed_s3_uri.hostname
        key = parsed_s3_uri.path.lstrip('/')
        region = boto3.session.Session().region_name  # Get the current AWS region
        print(region,"region")
        print(bucket_name, "bucket_name")
        print(key, "key")
        
        # Create a Textract client
        textract_client = boto3.client('textract')
        
        # Create an instance of TextractWrapper
        textract_wrapper = TextractWrapper(textract_client)
        
        # Analyze the document using Textract
        analysis_results = textract_wrapper.analyze_document('uni-artifacts', key, region=region)
        
        return analysis_results

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        return {"error": message}  # Return error message in case of ClientError

    except Exception as e:
        logger.error("An unexpected error occurred: %s", str(e))
        return {"error": "An unexpected error occurred"}  # Return generic error message for other exceptions

