import axios from "axios";
import fs from "fs";

export async function handler(event: any, context: any) {
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

  const endpoint =
    "https://d55gtzdu04.execute-api.us-east-1.amazonaws.com/dev-demo/sageMakerInvoke";

  const evaluationResults: any = {};

  try {
    for (let i = 0; i < infrastructureCriteria.length; i++) {
      const requestBody = {
        body: {
          inputs: `
          Below is the content describing the university's orientation day and the infrastructure criteria for evaluation:\n\n
          ${orientationDayText}\n\n
          Based on the provided evidence, evaluate the university's compliance and performance across the infrastructure indicators listed below. Provide a score from 1 to 5 for each indicator, along with specific examples or evidence supporting your assessment:\n\n
          Infrastructure Criteria:\n
          ${infrastructureCriteria[i]}\n\n
          For each indicator:\n
          - Assign a score from 1 to 5 based on the level of compliance and effectiveness.\n
          - Include specific examples or practices from the orientation day text to justify your score.\n
          - Highlight areas of strength and potential areas for improvement.\n\n
          Example Response:\n
          10.1 - Compliance with HEC regulations: Score 4 out of 5.\n
          The university conducts regular reviews of its premises and facilities to ensure compliance with HEC regulations. For example, the orientation day text mentions the maintenance of health and safety records by the Estates department, demonstrating a proactive approach to compliance.\n
         
          `,
          parameters: {
            max_tokens: 60000,
            temperature: 0.9,
          },
        },
      };

      const response = await axios.post(endpoint, requestBody);
      console.log("Response Data:", response.data); // Logging the response data for debugging
      const results = response.data;
      fs.appendFileSync(
        "evaluation_results.txt",
        JSON.stringify(response.data) + "\n\n"
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ evaluation_results: evaluationResults }),
    };
  } catch (error: any) {
    console.error("Error sending requests:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to process requests.",
        error: error.message,
      }),
    };
  }
}
