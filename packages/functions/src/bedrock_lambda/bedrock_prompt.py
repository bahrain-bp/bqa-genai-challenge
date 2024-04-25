import logging
import boto3
from botocore.exceptions import ClientError
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def analyze_document(bucket_name, key, region=None):
    """
    Analyzes a document stored in an S3 bucket using Textract.

    :param bucket_name: The name of the S3 bucket where the document is stored.
    :param key: The key of the document in the S3 bucket.
    :param region: The AWS region where the S3 bucket is located (optional).
    :return: The analysis job ID.
    """
    try:
        # If region is specified, use it; otherwise, let Textract client use default region
        if region:
            s3_client = boto3.client('s3', region_name=region)
        else:
            s3_client = boto3.client('s3')
        
        textract_client = boto3.client('textract')
        
        response = textract_client.analyze_document(
            Document={
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': key
                }
            },
            FeatureTypes=['TABLES', 'FORMS']
        )
        job_id = response['JobId']
        logger.info("Textract analysis started. Job ID: %s", job_id)
        return job_id
    except ClientError as e:
        logger.error("Textract analysis failed: %s", e)
        raise

def get_analysis_results(job_id):
    """
    Retrieves the analysis results for a Textract job.

    :param job_id: The ID of the Textract job.
    :return: The analysis results.
    """
    try:
        textract_client = boto3.client('textract')
        response = textract_client.get_document_analysis(JobId=job_id)
        logger.info("Retrieved analysis results for job %s", job_id)
        return response
    except ClientError as e:
        logger.error("Failed to retrieve analysis results for job %s: %s", job_id, e)
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
        
        # Analyze the document using Textract and retrieve the job ID
        job_id = analyze_document('uni-artifacts', 'bahrainPolyTechnic/standard3/Proposal Acceptance Form -Maryam (1).pdf', region=region)
        
        # Retrieve the analysis results using the job ID
        analysis_results = get_analysis_results(job_id)
        return analysis_results

    except ClientError as err:
        message = err.response["Error"]["Message"]
        logger.error("A client error occurred: %s", message)
        return {"error": message}  # Return error message in case of ClientError

    except Exception as e:
        logger.error("An unexpected error occurred: %s", str(e))
        return {"error": "An unexpected error occurred"}  # Return generic error message for other exceptions
