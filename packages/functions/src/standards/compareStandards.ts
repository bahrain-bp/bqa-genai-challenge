import { SQSEvent } from "aws-lambda";
import axios, { AxiosResponse } from "axios";
import * as AWS from "aws-sdk";
import { Queue } from "sst/node/queue";
export async function handler(event: any, app: any) {
  const orientationDayText: string = `
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
  const infrastructureCriteria: string = `
Indicator 10 - Infrastructure
Comments
Supporting Material
10.1   The institution ensures the compliance of its premises and facilities with the related HEC regulations through continuous reviews.

10.2   There are registers showing that the provided classrooms, tutorial and study spaces, library, offices, laboratories, amenities, medical facilities and security services are suitably equipped, sufficient and timetabled for the academic and non-academic activities and events.

10.3   There is a record of all physical infrastructure and equipment showing scheduled cleaning, maintenance and upgrades.

10.4   The institution has appropriate arrangements to ensure the security, efficiency, integrity and the availability of appropriate accommodation for conducting the examinations and other assessments.

10.5   There are formal, appropriate and implemented action plans whenever there is a need to modify or expand the institution’s premises, and/or facilities to satisfy the requirements of the academic and administrative operations.

10.6   There are effective published policies and processes for occupational health and safety that are made available to staff, students and visitors, and comply with the laws and regulations of the Kingdom of Bahrain.

10.7   Access to the premises is appropriately restricted, secured and convenient for staff and students with special needs.

10.8   Where applicable, the residential accommodation offered by the institution is clean, safe, supervised and of a standard which is adequate to the needs of students, and there are arrangements in place to ensure that regular inspections are conducted.
`;

  const requestBody = {
    body: {
      inputs:
        "Below is content that describes an evidence paired with the criteria that the evedince have to follow \n\n" +
        orientationDayText +
        "\n\nWrite a response to identify areas of strength for the universtiy and provide a score from 1 to 5 for each indicator." +
        "\n\nfollowing this criteria." +
        infrastructureCriteria +
        "for example this universty mets .... and so on",
      parameters: {
        max_tokens: 4000,
        temperature: 0.9,
      },
    },
  };
  //console.log(requestBody.body.inputs);

  // If the response is successful (status code 200), make a POST request to the SageMaker endpoint

  // Replace "Text" with the actual extracted text
  const endpoint =
    "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";

  try {
    // Make the POST request to the endpoint
    const response = await axios.post(endpoint, requestBody);

    // Log the response
    console.log(
      "Response from endpoint of the standards comparing:",
      response.data
    );
    // Now this needs to be saved in the database with the corresponding standard name/uni/fileURL
  } catch (error: any) {
    // Log any errors
    console.error("Error sending request:", error.message);
  }
}
