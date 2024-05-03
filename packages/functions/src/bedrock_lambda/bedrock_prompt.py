import json
import boto3
import requests

# Initialize SageMaker runtime client
runtime = boto3.client('sagemaker-runtime')

def main(event, context):
    try:
        # Extract message from SQS event
        sqs_records = event['Records']
        for record in sqs_records:
            # Extract message body
            message_body = json.loads(record['body'])
            # Extract payload from message body
            payload = message_body['payload']
            
            # Make prediction using SageMaker endpoint
            response = runtime.invoke_endpoint(
                EndpointName='meta-textgeneration-llama-2-7b-f-2024-04-22-15-17-49-877',
                Body=json.dumps(payload),
                ContentType='application/json'
            )
            
            # Parse the response
            response_body = response['Body'].read().decode()
            response_json = json.loads(response_body)
            generated_text = response_json[0]['generated_text']
            
            # You can define print_dialog function as per your requirement
            # print_dialog(payload, response_json)
            
            # Print generated text
            print("Generated text:", generated_text)
            
            # Post the generated text to the provided endpoint
            post_data = {
                'summary': generated_text
            }
            post_response = requests.post('https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke', json=post_data)
            print("POST Response:", post_response.text)
    except Exception as e:
        # Log error and return response
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
