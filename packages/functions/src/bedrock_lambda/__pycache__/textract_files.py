import boto3
import logging
from botocore.exceptions import ClientError

# Define the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)

class TextractWrapper:
    """Encapsulates Textract functions."""

    def __init__(self, textract_client, s3_resource, sqs_resource, queue_url):
        """
        :param textract_client: A Boto3 Textract client.
        :param s3_resource: A Boto3 Amazon S3 resource.
        :param sqs_resource: A Boto3 Amazon SQS resource.
        :param queue_url: The URL of the SQS queue to put job IDs into.
        """
        self.textract_client = textract_client
        self.s3_resource = s3_resource
        self.sqs_resource = sqs_resource
        self.queue_url = queue_url


    def get_analysis_job(self, job_id):
        """
        Gets data for a previously started detection job that includes additional
        elements.

        :param job_id: The ID of the job to retrieve.
        :return: The job data, including a list of blocks that describe elements
                 detected in the image.
        """
        try:
            response = self.textract_client.get_document_analysis(JobId=job_id)
            job_status = response["JobStatus"]
            logger.info("Job %s status is %s.", job_id, job_status)
        except ClientError:
            logger.exception("Couldn't get data for job %s.", job_id)
            raise
        else:
            return response


    def put_job_id_in_queue(self, job_id):
        """
        Puts a Textract job ID into the SQS queue.

        :param job_id: The ID of the Textract job to put into the queue.
        """
        try:
            self.sqs_resource.Queue(self.queue_url).send_message(MessageBody=job_id)
            logger.info("Job ID %s put into queue successfully.", job_id)
        except ClientError:
            logger.exception("Couldn't put job ID %s into queue.", job_id)
            raise

# Create Boto3 clients for Textract, S3, and SQS
textract_client = boto3.client('textract')
s3_resource = boto3.resource('s3')
sqs_resource = boto3.resource('sqs')

# Define the URL of your SQS queue
queue_url = 'https://sqs.us-east-1.amazonaws.com/211125580170/maryamtaraif-documents-queue.fifo'

# Create an instance of TextractWrapper
textract_wrapper = TextractWrapper(textract_client, s3_resource, sqs_resource, queue_url)

