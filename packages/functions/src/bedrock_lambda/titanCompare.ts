import { BedrockRuntime } from 'aws-sdk';
import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import * as winston from 'winston';
import { Logger } from 'winston';

const logger: Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

class ImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageError";
    }
}

const generateText = async (modelId: string, body: string): Promise<any> => {
    logger.info(`Generating text with Amazon Titan Text Express model ${modelId}`);

    const bedrock = new BedrockRuntime();
    const accept = "application/json";
    const contentType = "application/json";

    try {
        const response = await bedrock.invokeModel({
            body,
            modelId,
            accept,
            contentType
        }).promise();

        const responseBody = JSON.parse(response.body as string);
        const finishReason = responseBody.error;

        if (finishReason) {
            throw new ImageError(`Text generation error. Error is ${finishReason}`);
        }

        logger.info(`Successfully generated text with Amazon Titan Text Express model ${modelId}`);
        return responseBody;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate text: ${error.message}`);
        } else {
            throw new Error('Failed to generate text due to an unknown error');
        }
    }
}

const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        logger.info('Handler invoked');

        const modelId = 'amazon.titan-text-express-v1';
        const orientationDayText = `
        University Health and Safety - New Orientation Day
        Date: October 27th, 2016
        Estate and Support Services Introduction – Welcome
        What we do:
        - Health & Safety Advisory Service
        - Strategic estate development, planning and construction
        - Land and buildings maintenance
        - Alterations and infrastructure replacement
        - Space planning, utilization, and management
        How to Reach Us:
        - H&S, Maintenance & Housekeeping
        - All preventative as well as reactive maintenance records concerning H&S are maintained by Estates
        - Report housekeeping issues and maintenance through: university@gmail.bh
        - Ext 2302 - Allan
        - Ext 2200 - Ali
        Health and Safety Awareness
        Policy:
        - The University has a regard for the working environment and its most important asset, our employees and students, to ensure safety by managing as well as raising awareness of health and safety risks.
        University Responsibility:
        - Health and Safety within the University is the responsibility of every employee, student, supplier, and contractor.
        Employee Responsibility:
        - Take reasonable care of yourself and others and cooperate with the University by:
          - Following instructions
          - Attending training
          - Reporting hazards
        Campus Familiarity – Fire Safety & Arrangements
        Expectations:
        - Emergency procedures
        - Know your nearest exit (may not be the main entrance route)
        - Know your fire assembly point
        - What to do if you find a fire?
        - What to do if you hear the fire alarm?
          - Follow instructions and evacuate
        - Don’t attempt to fight a fire unless it is safe to do so (small fire), you have been trained in the use of fire extinguishers, and you have raised the alarm first.
        - Every second counts in an emergency. Be prepared. Prevent panic.
        - Further training is provided to FIRE WARDEN’s to assist in evacuation.
        Smoking Policy:
        - The University is strictly a smoke-free college.
        - Please do not smoke within 5 meters of the University.
        - Thank you for not smoking.
        Fire Alarm Test:
        - The University Campus is protected 24 hours a day by up-to-date systems and physical checks.
        - Weekly preventative maintenance is carried out through the Continuous Fire Alarm Test.
        - The Fire Alarm test is carried out every:
          - Every Thursday at 10 am
          - Duration: 10-20 seconds
        - Should the alarm be activated at any other time or continue longer than 1 minute, please evacuate immediately.
        First Aid:
        - Certified First Aider staff and their telephone numbers are displayed at reception in each of the buildings as well as notice boards.
        - Two AED Units located at the main reception and SRC reception.
        - The treatment room is located in office 130, on the first floor opposite LT1.
        - Occupational Health Officer: Donna Rice
        - Security hold key also for out of hours.
        - Familiarize yourself with:
          - Who the First Aiders are
          - Where the Treatment Room is
          - Where to report an incident
        Emergency Communications Contact:
        - Within THE UNIVERSITY dial 9 for an external line and dial 999 (9-999).
        - Always inform security of any incident or emergency.
        - Where possible, ask security to contact emergency services if required.
        - Contact Information:
          - Security
          - Core Building Reception
          - SRC Building Reception
          - Estates
            - Ext. 1000
            - Ext. 3511
            - Tel 17xxxxxx Ext. 5101
            - Ext. 2200
        - If you are the caller, give the phone number you are calling from.
        - Let security know so they can direct the emergency services.
        Security Arrangements:
        - Your staff ID badge and Car Sticker’s should be attained from office 204 in the Estates Department.
        - Entrance is permitted on presentation of either of these IDs at the main gate.
        - Visitor Access:
          - Notify in advance to Security Centre by emailing to security@THE UNIVERSITY.com, specifying the name, date, or time you are expecting the person(s).
          - If notification isn’t given to security, they will contact You/Estates/Reception to check whether anyone is expecting you to confirm whether to grant access.
          - If notice is not given in advance and you cannot be located, access will be denied.
        Further Information:
        - Contact:
          - Mr. Bill, Head of Estate and Support Services - Mobile No. 39xxxxxx
          - Ms. Judi, Occupational Health & Safety Advisor - Mobile No. 39xxxxxx
          - Office 205 Ext 2303
        `;
        const roomSizes = `Room #	Description	M2		ft.2
				
        001	Security /CCTV room	15	10.76	161.4
        002	Furniture storage room	25.2	10.76	271.2
        003	Maintenence storage room	40.5	10.76	435.8
        004	Carpet storage room	40.5	10.76	435.8
        005	AHU Room	36.2	10.76	389.5
        006	Copy Centre	30	10.76	322.8
        007	Exam Office File Store Room	24.5	10.76	263.6
        008	Pump room	23.4	10.76	251.8
        009	Spare store	10	10.76	107.6
        010	Maintenence Office	7.75	10.76	83.4
        011	Cleaners locker room	7	10.76	75.3
        012	Cleaners tea room	9.5	10.76	102.2
        013	Store room	3.75	10.76	40.4
        014	AHU Room	16	10.76	172.2
        015	Kitchen room	10.5	10.76	113.0
        016	Store room	36	10.76	387.4
        017	Electrical Switchroom	19.5	10.76	209.8
        018	Male WCs	15.6	10.76	167.9
        019	Female WCs	15.6	10.76	167.9
        020	Boiler room  (Maintenance) 	57.6	10.76	619.8
        021	Tank Room	135	10.76	1452.6
        022	Gas storage room	15.7	10.76	168.9
        023	Telecomms room	7.7	10.76	82.9
        024	Driver's Office	10.2	10.76	109.8
        025	Chilled food store	137	10.76	1474.1
        026	Dry food store	16.5	10.76	177.5
        027	Dry food store	16.5	10.76	177.5
        028	Lanscaper Area	43	10.76	462.7
        029	Compressor Room	8	10.76	86.1
        030	LV Switchroom  (Maintenance)	57	10.76	613.3
        031	Transformer room	75	10.76	807.0
        032	Maintenance Workshop	45.6	10.76	490.7
        033	Store room	7	10.76	75.3
        034	IT Room	36.5	10.76	392.7
        035	IT Room	23.4	10.76	251.8
        036	Store room	42	10.76	451.9
        037	Transformer room	66	10.76	710.2
        038	LV Switchroom  (Maintenance)	66	10.76	710.2
        039	Recycling Waste Area	8	10.76	86.1
        040	Admin Store room	22.4	10.76	241.0
        GD1	Group Study Room			
        GD2	Group Study Room			
        GD3	Group Study Room			
        GD4	Group Study Room			
        GD5	Group Study Room			
        GD6	Group Study Room			
        GD7	Research Room			
        GD8	Training Room			
        GD9	LRC Support Staff			
        GD10	Office			
        GD11	Meeting room			
        TD1	Kitchen			
        TD2	Store Room			`;

        const infrastructureCriteria: string[] = [
            `
          Indicator 10.1 - Compliance with HEC regulations:
          The institution ensures the compliance of its premises and facilities with the related HEC regulations through continuous reviews.
          `,
            `
          Indicator 10.2 - Provision of adequate facilities:
          There are registers showing that the provided classrooms, tutorial and study spaces, library, offices, laboratories, amenities, medical facilities and security services are suitably equipped, sufficient and timetabled for the academic and non-academic activities and events.
          `,
            `
          Indicator 10.3 - Record-keeping:
          There is a record of all physical infrastructure and equipment showing scheduled cleaning, maintenance and upgrades.
          `,
            // Add more criteria for other indicators...
        ];

        // for (const criterion of infrastructureCriteria) {
        const prompt = `
                Below is the content describing the university's room sizes and the infrastructure criteria for evaluation:\n\n
                ${roomSizes}\n\n
                Based on the provided evidence, evaluate the university's compliance and performance across the infrastructure indicators listed below. Provide a score from 1 to 5 for each indicator, along with specific examples or evidence supporting your assessment:\n\n
                Below is the Infrastructure Criteria:\n
                ${infrastructureCriteria}\n\n
                For each indicator:\n
                - Assign a score from 1 to 3 out of 3 based on the level of compliance and effectiveness.\n
                - Include Evaluation, supporting evidence from the provided room sizes content to justify your score with examples.\n
            
               `;

        logger.info(`Prompt: ${prompt}`);

        const body = JSON.stringify({
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 4096,
                stopSequences: [],
                temperature: 0,
                topP: 1
            }
        });

        const responseBody = await generateText(modelId, body);

        // const response = { prompt, results: responseBody.results };
        // logger.info(JSON.stringify(response.results));

        // Extract and join the outputText fields from the results
        const outputTexts = responseBody.results.map((result: { outputText: any; }) => result.outputText).join('\n\n');

        // Log the outputTexts in a readable format
        logger.info(outputTexts);

        const response = { prompt, results: outputTexts };


        return response;

    } catch (err) {
        if (err instanceof Error) {
            logger.error(`An error occurred: ${err.message}`);
            return { error: err.message };
        } else {
            logger.error('An unexpected error occurred');
            return { error: 'An unexpected error occurred' };
        }
    }
}

export { handler };
