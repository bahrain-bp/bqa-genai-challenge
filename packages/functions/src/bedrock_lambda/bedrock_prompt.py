import logging
import boto3
from botocore.exceptions import ClientError
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class TextractWrapper:
    """Encapsulates Textract functions."""

    def __init__(self, textract_client):
        """
        :param textract_client: A Boto3 Textract client.
        """
        self.textract_client = textract_client

    def analyze_document(self, bucket_name, key):
        """
        Analyzes a document stored in an S3 bucket using Textract.

        :param bucket_name: The name of the S3 bucket where the document is stored.
        :param key: The key of the document in the S3 bucket.
        :return: The analysis results from Textract.
        """
        try:
            response = self.textract_client.analyze_document(
                Document={
                    'S3Object': {
                        'Bucket': bucket_name,
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
        if not parsed_s3_uri.scheme or not parsed_s3_uri.netloc:
            raise ValueError("Invalid S3 URI format")

        bucket_name = parsed_s3_uri.netloc
        key = parsed_s3_uri.path.lstrip('/')
        
        # Create a Textract client
        textract_client = boto3.client('textract')
        
        # Create an instance of TextractWrapper
        textract_wrapper = TextractWrapper(textract_client)
        
        # Analyze the document using Textract
        analysis_results = textract_wrapper.analyze_document(bucket_name, key)
        
        return analysis_results

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        return {"error": message}  # Return error message in case of ClientError

    except Exception as e:
        logger.error("An unexpected error occurred: %s", str(e))
        return {"error": "An unexpected error occurred"}  # Return generic error message for other exceptions
