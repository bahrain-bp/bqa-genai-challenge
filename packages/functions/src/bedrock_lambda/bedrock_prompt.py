import sagemaker
from sagemaker.predictor import Predictor
from sagemaker.serializers import JSONSerializer
from sagemaker.deserializers import JSONDeserializer

# Define the SageMaker session
session = sagemaker.Session()

# Specify the endpoint name
endpoint_name = 'meta-textgeneration-llama-2-7b-f-2024-04-22-15-17-49-877'

# Create a predictor object
predictor = Predictor(endpoint_name=endpoint_name,
                      sagemaker_session=session,
                      serializer=JSONSerializer(),
                      deserializer=JSONDeserializer())

# Define your input data
input_data = {
    'please summarize this in 5 bullet points': "2.4 Standard 4 – Infrastructure, Information and Communications Technology and Learning Resources\n\
The institution has appropriate and sufficient physical infrastructure, ICT and learning resources to support the academic programmes and administrative operations of the institution.\n\
Indicator 10 - Infrastructure\n\
The institution provides physical infrastructure that is safe and demonstrably adequate for its type and core functions.\n\
What is expected of HEIs operating in the Kingdom of Bahrain:\n\
10.1 The institution ensures the compliance of its premises and facilities with the related HEC regulations through continuous reviews.\n\
10.2 There are registers showing that the provided classrooms, tutorial and study spaces, library, offices, laboratories, amenities, medical facilities and security services are suitably equipped, sufficient and timetabled for the academic and non-academic activities and events.\n\
10.3 There is a record of all physical infrastructure and equipment showing scheduled cleaning, maintenance and upgrades.\n\
10.4 The institution has appropriate arrangements to ensure the security, efficiency, integrity and the availability of appropriate accommodation for conducting the examinations and other assessments.\n\
10.5 There are formal, appropriate and implemented action plans whenever there is a need to modify or expand the institution’s premises, and/or facilities to satisfy the requirements of the academic and administrative operations.\n\
10.6 There are effective published policies and processes for occupational health and safety that are made available to staff, students and visitors, and comply with the laws and regulations of the Kingdom of Bahrain.\n\
10.7 Access to the premises is appropriately restricted, secured and convenient for staff and students with special needs.\n\
10.8 Where applicable, the residential accommodation offered by the institution is clean, safe, supervised and of a standard which is adequate to the needs of students, and there are arrangements in place to ensure that regular inspections are conducted."
}


# Perform inference by calling the predictor's predict method
result = predictor.predict(input_data)

# Print the result
print(result)
