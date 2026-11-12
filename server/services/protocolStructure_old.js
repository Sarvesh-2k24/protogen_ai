{
  "template": "NIH-FDA Phase 2 and 3 IND/IDE Clinical Trial Protocol Template",
    "systemPrompt": "You are an expert clinical protocol writer experienced in ICH E6 GCP, ICH E9, FDA 21 CFR Parts 50, 56, 312 and 812, and the NIH-FDA Phase 2 and 3 IND/IDE protocol template. Write formal, precise, regulatory-grade protocol text in the future tense ('will be'). Use only the study details provided in STUDY CONTEXT; never invent drug data, results, statistics, references or regulatory numbers. Where information is missing, insert a clear placeholder in angle brackets, e.g. <specify dose>. Keep all content consistent with previously generated sections. Use Markdown: '#' headings with the exact section number and title given, numbered lists for criteria, Markdown tables where requested, Mermaid for diagrams. Do not use em dashes. Output only the section content, with no preamble or commentary.",
      "userPromptTemplate": "STUDY CONTEXT:\n{{study_context}}\n\nPREVIOUSLY GENERATED SECTIONS (for consistency):\n{{previous_sections_summary}}\n\nTASK: Write Section {{number}} {{title}} of the clinical trial protocol in detail.\n\nSECTION INSTRUCTIONS:\n{{prompt}}\n\nBegin with the heading '{{markdown_heading}} {{number}} {{title}}'.",
        "headingOnlyRule": "For nodes with headingOnly=true, output only the heading (no body text) and generate each child node separately.",
          "placeholders": {
    "{{study_context}}": "Study details: title, indication, phase, intervention, dose, comparator, population, sample size, sites, countries, sponsor, PI, endpoints, timelines",
      "{{previous_sections_summary}}": "Concise summary of already generated sections",
        "{{countries}}": "Countries where the trial runs",
          "{{markdown_heading}}": "'#' repeated per node level (1 = #, 2 = ##, 3 = ###)"
  },
  "sections": [
    {
      "id": "SOC",
      "number": "",
      "title": "STATEMENT OF COMPLIANCE",
      "level": 1,
      "headingOnly": false,
      "prompt": "Write the Statement of Compliance. State that the trial will be conducted in accordance with the protocol, ICH Good Clinical Practice (ICH E6), the Declaration of Helsinki and applicable regulations: 45 CFR Part 46, 21 CFR Parts 50, 56, 312 and/or 812, plus any local/national regulations for {{countries}}. State that all investigators and site staff responsible for the conduct, management or oversight of the trial have completed Human Subjects Protection and ICH GCP training. State that the protocol, informed consent form(s), recruitment materials and all participant materials will be submitted to the IRB/IEC for review and approval, that approval of both protocol and consent form must be obtained before any participant is enrolled, that any amendment requires IRB/IEC review and approval before implementation, and that participants will be re-consented when an amendment affects them. Include a statement that each engaged institution holds a current Federal-Wide Assurance (FWA) where applicable. Write in formal regulatory prose, 2 to 4 paragraphs."
    },
    {
      "id": "1",
      "number": "1",
      "title": "PROTOCOL SUMMARY",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "1.1",
          "number": "1.1",
          "title": "Synopsis",
          "level": 2,
          "headingOnly": false,
          "prompt": "Write the protocol Synopsis as a two-column Markdown table (Field | Content) with these rows in order: Title; Study Description (3 to 5 sentences including a brief statement of the study hypothesis); Objectives (Primary Objective, then Secondary Objectives, worded exactly as in Section 3); Endpoints (Primary Endpoint, then Secondary Endpoints, worded exactly as in Section 3, with measurement and timepoint); Study Population (sample size, sex, age range, demographic group, general health status, geographic location); Phase; Description of Sites/Facilities Enrolling Participants (number and type of sites, countries); Description of Study Intervention (name, dose, route, frequency, duration; for devices, key components); Study Duration (months from first enrolment to completion of data analyses); Participant Duration (months per participant from screening to last visit). Keep every entry consistent with the rest of the protocol."
        },
        {
          "id": "1.2",
          "number": "1.2",
          "title": "Schema",
          "level": 2,
          "headingOnly": false,
          "prompt": "Create a one-page study schema as a Mermaid flowchart (top-down). Show: Prior to enrolment (screening, total number screened), Day/Week of randomization or allocation with total N, each study arm with N and intervention/dose, treatment period, scheduled in-clinic visits and telephone contacts with timepoints, follow-up period, end of study, and where primary and secondary endpoints are assessed. Below the diagram add 2 to 3 sentences explaining the flow. Use the visit schedule from Section 1.3."
        },
        {
          "id": "1.3",
          "number": "1.3",
          "title": "Schedule of Activities (SoA)",
          "level": 2,
          "headingOnly": false,
          "prompt": "Create the Schedule of Activities as a Markdown table. Columns: Procedure, Screening (Day -x to -1), Enrolment/Baseline (Day 1), each scheduled visit with study day and visit window (e.g. Day 28 +/- 3), telephone contacts, Final Visit, Early Termination Visit, Unscheduled Visit. Rows: informed consent, eligibility review, demographics, medical history, randomization, study intervention administration/dispensing, intervention accountability/compliance, concomitant medication review, physical examination (complete or symptom-directed), vital signs, height and weight, hematology, biochemistry/chemistry, coagulation, urinalysis, pregnancy test, ECG, efficacy assessments named in Section 8.1, other assays/biomarkers, AE review and evaluation, SAE review, CRF completion. Mark applicable cells with X. Add numbered footnotes explaining conditions (e.g. pregnancy test only for participants of childbearing potential, fasting requirements). Ensure every procedure in Sections 8.1 and 8.2 appears."
        }
      ]
    },
    {
      "id": "2",
      "number": "2",
      "title": "INTRODUCTION",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "2.1",
          "number": "2.1",
          "title": "Study Rationale",
          "level": 2,
          "headingOnly": false,
          "prompt": "Write the Study Rationale (2 to 4 paragraphs). State the research problem: the target population, the disease and its burden, the current standard of care, its limitations and the specific gap in knowledge or available therapy. Explain why this trial is needed now and how its results will address the gap. End with a sentence linking the rationale to the primary objective."
        },
        {
          "id": "2.2",
          "number": "2.2",
          "title": "Background",
          "level": 2,
          "headingOnly": false,
          "prompt": "Write the Background in detail with these parts: (a) disease background, epidemiology and pathophysiology; (b) summary of nonclinical in vitro and in vivo findings of potential clinical significance (pharmacology, toxicology); (c) summary of prior clinical research and any history of human use or exposure to the study intervention, including use in other countries and clinical pharmacology/PK data; (d) discussion of important literature and data relevant to the trial; (e) public health context and importance of the trial, including any treatment controversies. Cite sources as numbered references that will be listed in Section 11. Do not invent study results or references; insert [REF NEEDED] placeholders where a citation is required but not provided."
        },
        {
          "id": "2.3",
          "number": "2.3",
          "title": "Risk/Benefit Assessment",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "2.3.1",
              "number": "2.3.1",
              "title": "Known Potential Risks",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe known potential risks of participation, using the Investigator's Brochure, package insert or device labeling as the primary source. Cover: risks of the study intervention (frequency and severity of known adverse reactions, organized by system), risks of the control/placebo, risks of study procedures (blood draws, imaging, biopsies, questionnaires), psychological, social, legal and economic risks, risks to confidentiality, and reproductive risks. Distinguish immediate from long-range risks. For each major risk, state the measures taken to minimize it."
            },
            {
              "id": "2.3.2",
              "number": "2.3.2",
              "title": "Known Potential Benefits",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe known potential benefits from clinical or nonclinical data, using the IB or package insert as the primary source. Distinguish potential direct benefits to individual participants (immediate and long-range) from benefits to society and future patients. If no direct benefit is expected, state this clearly. Avoid overstating efficacy of an investigational product."
            },
            {
              "id": "2.3.3",
              "number": "2.3.3",
              "title": "Assessment of Potential Risks and Benefits",
              "level": 3,
              "headingOnly": false,
              "prompt": "Provide the overall risk-benefit assessment: why exposing participants to the identified risks is necessary to answer the research question, a summary of measures to minimize risks and maximize benefits (eligibility criteria, monitoring, stopping rules, safety oversight), why the risks are reasonable in relation to anticipated benefits and the knowledge to be gained, and the alternative treatments available to potential participants outside the trial."
            }
          ]
        }
      ]
    },
    {
      "id": "3",
      "number": "3",
      "title": "OBJECTIVES AND ENDPOINTS",
      "level": 1,
      "headingOnly": false,
      "prompt": "Write a short introduction (2 to 3 sentences) noting that objectives and endpoints align with ClinicalTrials.gov Primary Purpose and Outcome Measures. Then create a 3-column Markdown table: OBJECTIVES | ENDPOINTS | JUSTIFICATION FOR ENDPOINTS, with row groups Primary, Secondary and Tertiary/Exploratory. Express each objective as a statement of purpose (to assess, to determine, to compare, to evaluate) naming efficacy or safety. Each endpoint must specify the exact variable, measurement method/instrument, unit or scale, and timepoint (e.g. change from baseline to Week 24). Justify each endpoint (clinical relevance, validation, regulatory acceptance). Keep endpoints prioritized and consistent with Sections 1.1, 9.1 and 9.4."
    },
    {
      "id": "4",
      "number": "4",
      "title": "STUDY DESIGN",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "4.1",
          "number": "4.1",
          "title": "Overall Design",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe the overall design, consistent with Sections 1.1 and 1.2. Include: the study hypothesis; phase; design type (randomized, placebo- or active-controlled, blinding level, parallel/crossover, superiority/non-inferiority, adaptive or group sequential if any); methods to minimize bias; number of arms, randomization ratio, intervention and its duration; single or multi-site and countries; name of study intervention(s); planned interim analysis (refer to Section 9.4.6); stratification factors (refer to Section 9.4.7); any sub-studies. Reference dose escalation details in Section 6.1.2."
        },
        {
          "id": "4.2",
          "number": "4.2",
          "title": "Scientific Rationale for Study Design",
          "level": 2,
          "headingOnly": false,
          "prompt": "Justify the design: rationale for the type and selection of control (placebo, active comparator, dose-response, historical), choice of superiority vs non-inferiority, blinding, randomization, study duration and endpoint timing. Discuss known or potential problems with the chosen control in this disease (e.g. ethics of placebo, rescue therapy) and how they are addressed."
        },
        {
          "id": "4.3",
          "number": "4.3",
          "title": "Justification for Dose",
          "level": 2,
          "headingOnly": false,
          "prompt": "Justify the route of administration, starting dose, planned maximum dose, dosing interval and regimen of the study intervention and control, using nonclinical data (e.g. NOAEL, safety margins), prior clinical PK/PD and Phase 1/2 dose-response data, and approved labeling where applicable. If no prior data support the dose, state that explicitly."
        },
        {
          "id": "4.4",
          "number": "4.4",
          "title": "End of Study Definition",
          "level": 2,
          "headingOnly": false,
          "prompt": "Define when a participant is considered to have completed the study (completed all phases including the last visit or last scheduled procedure in the SoA) and define the end of the study (date of the last visit or last scheduled procedure of the last participant, as shown in the SoA)."
        }
      ]
    },
    {
      "id": "5",
      "number": "5",
      "title": "STUDY POPULATION",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "5.1",
          "number": "5.1",
          "title": "Inclusion Criteria",
          "level": 2,
          "headingOnly": false,
          "prompt": "Write numbered inclusion criteria introduced by: 'In order to be eligible to participate in this study, an individual must meet all of the following criteria:'. Include: provision of signed and dated informed consent; willingness to comply with all procedures and availability for the study duration; sex and age range; diagnosis with explicit diagnostic criteria; disease duration and severity thresholds; specific laboratory values with units; ability to take the study intervention and adhere to the regimen; for participants of reproductive potential, commitment to use specified highly effective contraception for a defined period; agreement to lifestyle considerations in Section 5.3. Each criterion must be objective and verifiable. Do not repeat any criterion as an exclusion."
        },
        {
          "id": "5.2",
          "number": "5.2",
          "title": "Exclusion Criteria",
          "level": 2,
          "headingOnly": false,
          "prompt": "Write numbered exclusion criteria introduced by: 'An individual who meets any of the following criteria will be excluded from participation in this study:'. Include: prohibited concomitant or prior therapies with washout periods; pregnancy or lactation; known hypersensitivity to intervention components; clinically significant comorbidities; hepatic and renal impairment thresholds with lab values; recent febrile/acute illness; participation in another investigational trial within a defined period; conditions that, in the investigator's opinion, compromise safety or data integrity. End with a statement on equitable selection and justification for excluding any specific population."
        },
        {
          "id": "5.3",
          "number": "5.3",
          "title": "Lifestyle Considerations",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe restrictions during the study: diet and food/drink restrictions, timing of meals relative to dosing, caffeine, alcohol, tobacco/nicotine, physical activity limits, blood/plasma donation, and considerations for household contacts. Specify the period each restriction applies (e.g. from x hours before first dose until after final dose) and the action taken if a restriction is violated."
        },
        {
          "id": "5.4",
          "number": "5.4",
          "title": "Screen Failures",
          "level": 2,
          "headingOnly": false,
          "prompt": "Define screen failures as participants who consent but are not subsequently randomly assigned or entered in the study. State the minimal data collected for CONSORT reporting (demography, screen failure reason, eligibility criteria not met, any SAE). Describe the rescreening policy for modifiable factors (which factors, how many times, time interval) and that rescreened participants keep the same participant number."
        },
        {
          "id": "5.5",
          "number": "5.5",
          "title": "Strategies for Recruitment and Retention",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe: target sample size by sex, race, ethnicity and age and anticipated number to be screened; anticipated accrual rate; number of sites and participants from US and non-US sites; sources of participants and recruitment venues; how potential participants are identified and approached; recruitment strategies (patient groups, advertising, social media); retention procedures (visit reminders, multiple contact methods, flexible scheduling); strategies to include historically under-represented populations; justification and protections for any vulnerable participants; compensation or incentives (amount, form, timing, prorating). Use placeholders where figures are not provided."
        }
      ]
    },
    {
      "id": "6",
      "number": "6",
      "title": "STUDY INTERVENTION",
      "level": 1,
      "headingOnly": false,
      "prompt": "Write a short introduction (2 to 3 sentences) naming the study intervention(s) and control product and their regulatory status (IND/IDE). If more than one product, state that Sections 6.1 and 6.2 describe each separately.",
      "children": [
        {
          "id": "6.1",
          "number": "6.1",
          "title": "Study Intervention(s) Administration",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "6.1.1",
              "number": "6.1.1",
              "title": "Study Intervention Description",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe each study intervention and control product: name (generic and code), class and mechanism of action, formulation and strength, manufacturer, regulatory status (approved/investigational, IND/IDE number placeholder), and the matching placebo or comparator. Source from the IB, package insert or device labeling."
            },
            {
              "id": "6.1.2",
              "number": "6.1.2",
              "title": "Dosing and Administration",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe dosing for each arm: starting dose, dose level(s), route, frequency, timing relative to meals and time of day, who administers (site staff or self), duration of treatment, minimum and maximum exposure, titration or escalation steps, dose modification/holding rules for toxicity, re-escalation rules, and instructions for missed or vomited doses. Present arm-by-arm dosing in a Markdown table."
            }
          ]
        },
        {
          "id": "6.2",
          "number": "6.2",
          "title": "Preparation/Handling/Storage/Accountability",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "6.2.1",
              "number": "6.2.1",
              "title": "Acquisition and accountability",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe how the intervention and control are supplied to sites (supplier, repository/pharmacy), shipment and receipt procedures, accountability records (dispensing and return logs maintained by the investigator or pharmacist), reconciliation, and disposal or return of expired and unused product, per sponsor SOPs."
            },
            {
              "id": "6.2.2",
              "number": "6.2.2",
              "title": "Formulation, Appearance, Packaging, and Labeling",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe formulation, appearance (color, shape, markings), packaging (bottles, blisters, vials, kits), and labeling of the intervention and control as supplied, including manufacturer name, blinded label content and the investigational caution statement required under 21 CFR 312.6 or 812.5."
            },
            {
              "id": "6.2.3",
              "number": "6.2.3",
              "title": "Product Storage and Stability",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe storage conditions (temperature range, light, humidity), temperature monitoring and excursion procedures, in-use stability, multi-dose vial expiry after first puncture, and shelf-life/retest information."
            },
            {
              "id": "6.2.4",
              "number": "6.2.4",
              "title": "Preparation",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe step-by-step preparation by staff or participants: thawing, reconstitution, dilution, mixing, aseptic technique, time limits between preparation and administration, and maintenance of blinding during preparation; reference a pharmacy manual or MOP where appropriate. For devices, describe set-up and calibration."
            }
          ]
        },
        {
          "id": "6.3",
          "number": "6.3",
          "title": "Measures to Minimize Bias: Randomization and Blinding",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe the randomization procedure (allocation ratio, method such as permuted blocks without disclosing block size, stratification factors, system such as IRT/web-based), who generates and holds the schedule, and allocation concealment. Describe blinding (who is blinded: participants, investigators, outcome assessors, statisticians), how blinding is maintained (matching placebo, packaging), and unblinding: emergency unblinding criteria, who may unblind, procedure, documentation and notification of sponsor and Medical Monitor, and planned unblinding at study end."
        },
        {
          "id": "6.4",
          "number": "6.4",
          "title": "Study Intervention Compliance",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe how adherence is assessed and verified (direct observation, pill counts, returned vials, diaries/eDiaries, plasma assays, electronic monitors), the documents to complete (participant drug log) and source documents, the acceptable compliance range (e.g. 80% to 120%), and actions for non-compliance including re-education and documentation."
        },
        {
          "id": "6.5",
          "number": "6.5",
          "title": "Concomitant Therapy",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe concomitant therapy rules consistent with the eligibility criteria: what is recorded (medication, dose, route, start/stop dates, indication) for prescription and OTC drugs, supplements, complementary therapies and procedures; the recording period (e.g. from x days before screening to end of study); permitted medications; prohibited medications with washout periods (use a table); and the action if a prohibited medication is taken.",
          "children": [
            {
              "id": "6.5.1",
              "number": "6.5.1",
              "title": "Rescue Medicine",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, list rescue medications, treatments or procedures, criteria for their use, dosing and administration instructions, supply source, whether use is recorded and how it affects endpoint assessment. If not applicable, state 'Not applicable.'"
            }
          ]
        }
      ]
    },
    {
      "id": "7",
      "number": "7",
      "title": "STUDY INTERVENTION DISCONTINUATION AND PARTICIPANT DISCONTINUATION/WITHDRAWAL",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "7.1",
          "number": "7.1",
          "title": "Discontinuation of Study Intervention",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe criteria for permanent discontinuation of study intervention (halting rules, specific lab or clinical thresholds, AEs, pregnancy, investigator judgment) and for temporary interruption with criteria for resumption. State that discontinuation of the intervention does not mean discontinuation from the study and that remaining procedures and safety follow-up continue. Describe follow-up of clinically significant findings and list the data collected at the time of discontinuation."
        },
        {
          "id": "7.2",
          "number": "7.2",
          "title": "Participant Discontinuation/Withdrawal from the Study",
          "level": 2,
          "headingOnly": false,
          "prompt": "State that participants may withdraw at any time upon request. List reasons an investigator may withdraw a participant (pregnancy, significant non-compliance, AE or lab abnormality making continuation not in their best interest, disease progression requiring discontinuation, newly identified exclusion criterion, inability to receive intervention for a defined period). State that the reason is recorded on the CRF, describe procedures and data collected at an early termination visit, handling of samples/data after consent withdrawal, and the participant replacement policy."
        },
        {
          "id": "7.3",
          "number": "7.3",
          "title": "Lost to Follow-Up",
          "level": 2,
          "headingOnly": false,
          "prompt": "Define lost to follow-up (failure to return for a specified number of scheduled visits and cannot be contacted). Describe required actions: attempt to reschedule within a defined time frame and counsel on importance of the schedule; before declaring lost to follow-up, make every effort to regain contact (where possible, 3 telephone calls and, if necessary, a certified letter to the last known address), documented in the medical record or study file; if still unreachable, consider the participant withdrawn with primary reason lost to follow-up."
        }
      ]
    },
    {
      "id": "8",
      "number": "8",
      "title": "STUDY ASSESSMENTS AND PROCEDURES",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "8.1",
          "number": "8.1",
          "title": "Efficacy Assessments",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe in detail every procedure supporting the primary and secondary efficacy endpoints: the screening sequence and eligibility decision points, the instruments/scales/imaging/lab methods used, scoring, timing per the SoA, who performs each assessment and required qualifications or training, standardization and central/blinded reading, and procedures at the final or early termination visit (refer to Section 7). Use subheadings per assessment."
        },
        {
          "id": "8.2",
          "number": "8.2",
          "title": "Safety and Other Assessments",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe all safety and other procedures: screening window before enrolment, medical history, complete and symptom-directed physical examinations, vital signs (method, position, rest time), height and weight, ECGs, clinical laboratory tests (list hematology, chemistry, coagulation, urinalysis, pregnancy, serology panels in a table), imaging, biological specimen collection, processing, storage and shipment, local vs central laboratory, total blood volume per participant, and counselling procedures. State how clinically significant abnormal results are handled."
        },
        {
          "id": "8.3",
          "number": "8.3",
          "title": "Adverse Events and Serious Adverse Events",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "8.3.1",
              "number": "8.3.1",
              "title": "Definition of Adverse Events (AE)",
              "level": 3,
              "headingOnly": false,
              "prompt": "Provide the AE definition per 21 CFR 312.32(a): any untoward medical occurrence associated with the use of a drug in humans, whether or not considered drug related. Clarify what is and is not an AE (e.g. worsening of pre-existing conditions, abnormal labs judged clinically significant, procedures vs underlying conditions)."
            },
            {
              "id": "8.3.2",
              "number": "8.3.2",
              "title": "Definition of Serious Adverse Events (SAE)",
              "level": 3,
              "headingOnly": false,
              "prompt": "Provide the SAE definition per 21 CFR 312.32(a) (and 21 CFR 812.3(s) for devices): an AE or suspected adverse reaction that results in death, is life-threatening, requires inpatient hospitalization or prolongation of existing hospitalization, results in persistent or significant incapacity, is a congenital anomaly/birth defect, or is an important medical event based on appropriate medical judgment. Give examples of important medical events and clarify elective hospitalizations."
            },
            {
              "id": "8.3.3",
              "number": "8.3.3",
              "title": "Classification of an Adverse Event",
              "level": 3,
              "headingOnly": false,
              "prompt": "Write three subheadings. Severity of Event: define the grading scale (e.g. Mild, Moderate, Severe with definitions, or CTCAE version x grades 1 to 5) and clarify severity vs seriousness. Relationship to Study Intervention: define causality categories (e.g. Related / Not Related, or Definitely, Probably, Potentially, Unlikely, Unrelated) with criteria such as temporal relationship, dechallenge/rechallenge and alternative causes, assessed by a licensed clinician. Expectedness: state who determines expectedness, the reference safety information (IB section, package insert or device labeling) and define unexpected per FDA."
            },
            {
              "id": "8.3.4",
              "number": "8.3.4",
              "title": "Time Period and Frequency for Event Assessment and Follow-Up",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe how AEs are elicited (solicited and unsolicited), when collection starts and ends (e.g. from ICF signature through x days after last dose), frequency of assessment per visit, recording on CRF (description, onset/resolution dates, severity, causality, action taken, outcome), recording of pre-existing conditions and changes, follow-up of events until resolution or stabilization, and handling of events ongoing at study end and SAEs learned of after study end."
            },
            {
              "id": "8.3.5",
              "number": "8.3.5",
              "title": "Adverse Event Reporting",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe investigator responsibilities and timeframes for recording and reporting non-serious AEs to the sponsor and oversight bodies (DSMB/SMC, IRB) per their requirements, the forms/system used, and reference to the MOP/SOP flow chart."
            },
            {
              "id": "8.3.6",
              "number": "8.3.6",
              "title": "Serious Adverse Event Reporting",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe SAE reporting: investigator reports all SAEs to the sponsor immediately per 21 CFR 312.64(b) (specify timeframe, e.g. within 24 hours of awareness), regardless of causality; forms, contacts and sign-off; follow-up reports; Medical Monitor review; sponsor expedited IND safety reports to FDA and investigators (fatal or life-threatening unexpected suspected adverse reactions within 7 calendar days, other serious unexpected suspected adverse reactions within 15 calendar days per 21 CFR 312.32); for devices, unanticipated adverse device effects per 21 CFR 812.150. Note the IRB reporting requirements. Verify all timelines against current regulations."
            },
            {
              "id": "8.3.7",
              "number": "8.3.7",
              "title": "Reporting Events to Participants",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, describe how participants will be informed of AEs, SAEs and study results individually or in aggregate, and the plan for detecting and managing incidental findings. Otherwise state 'Not applicable.'"
            },
            {
              "id": "8.3.8",
              "number": "8.3.8",
              "title": "Events of Special Interest",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, define adverse events of special interest for this intervention, the rationale, additional data collected and reporting timelines to the sponsor, study leadership, IRB and regulators. Otherwise state 'Not applicable.'"
            },
            {
              "id": "8.3.9",
              "number": "8.3.9",
              "title": "Reporting of Pregnancy",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, state the pregnancy policy: pregnancy is not an AE; required reporting to the sponsor (timeframe and form), IRB and regulators; discontinuation of study intervention while continuing safety follow-up; follow-up to pregnancy outcome and infant status; pregnancy in partners of male participants. Otherwise state 'Not applicable.'"
            }
          ]
        },
        {
          "id": "8.4",
          "number": "8.4",
          "title": "Unanticipated Problems",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "8.4.1",
              "number": "8.4.1",
              "title": "Definition of Unanticipated Problems (UP)",
              "level": 3,
              "headingOnly": false,
              "prompt": "Give the OHRP definition: any incident, experience or outcome that meets all of: unexpected in nature, severity or frequency given the research procedures and population; related or possibly related to participation; and suggests the research places participants or others at greater risk of harm than previously known or recognized."
            },
            {
              "id": "8.4.2",
              "number": "8.4.2",
              "title": "Unanticipated Problem Reporting",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe investigator reporting of UPs to the IRB and coordinating center/lead PI, the required report content (protocol identifiers, participant ID, detailed description, basis for UP determination, proposed corrective actions), and timelines (e.g. UPs that are SAEs within x days of awareness, other UPs within x days, all UPs reported to OHRP and funder within x days of IRB receipt). Use placeholders for site-specific timelines."
            },
            {
              "id": "8.4.3",
              "number": "8.4.3",
              "title": "Reporting Unanticipated Problems to Participants",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, describe how participants will be informed of UPs individually or in aggregate and whether re-consent is required. Otherwise state 'Not applicable.'"
            }
          ]
        }
      ]
    },
    {
      "id": "9",
      "number": "9",
      "title": "STATISTICAL CONSIDERATIONS",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "9.1",
          "number": "9.1",
          "title": "Statistical Hypotheses",
          "level": 2,
          "headingOnly": false,
          "prompt": "State formal null (H0) and alternative (H1) hypotheses for the primary endpoint and each key secondary endpoint, the comparison type (superiority, non-inferiority with margin and its justification, equivalence, dose response), the parameter compared (mean difference, proportion, hazard ratio), sidedness and significance level, and the timepoint of analysis."
        },
        {
          "id": "9.2",
          "number": "9.2",
          "title": "Sample Size Determination",
          "level": 2,
          "headingOnly": false,
          "prompt": "Provide the sample size calculation: outcome measure, statistical test, two-sided alpha, power, assumed effect size and variability (SD, event rates, hazard ratio) with the source of each assumption, allocation ratio, expected dropout/non-adherence and resulting inflation, final numbers to screen, randomize and per arm. Include a table showing sample size across a range of plausible assumptions to show robustness. Note adjustments for interim analyses or multiplicity and the software used. Do not invent assumptions; use placeholders if not provided."
        },
        {
          "id": "9.3",
          "number": "9.3",
          "title": "Populations for Analyses",
          "level": 2,
          "headingOnly": false,
          "prompt": "Define each analysis set: Intention-to-Treat (all randomized, analyzed as randomized), Modified ITT (e.g. randomized and received at least one dose with at least one post-baseline assessment), Safety Analysis Set (received at least one dose, analyzed as treated), Per-Protocol (ITT participants without major protocol deviations, with criteria for exclusion defined before unblinding), and any other sensitivity datasets. State which set is used for each analysis."
        },
        {
          "id": "9.4",
          "number": "9.4",
          "title": "Statistical Analyses",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "9.4.1",
              "number": "9.4.1",
              "title": "General Approach",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe: descriptive statistics for continuous (n, mean, SD, median, range) and categorical (counts, percentages) data; significance level, confidence intervals, one or two-sided tests; whether covariates are pre-specified here or in the SAP; checks of model assumptions and corrective approaches (transformation, nonparametric methods); software; and that full details will be in a SAP finalized before database lock/unblinding."
            },
            {
              "id": "9.4.2",
              "number": "9.4.2",
              "title": "Analysis of the Primary Efficacy Endpoint(s)",
              "level": 3,
              "headingOnly": false,
              "prompt": "For each primary endpoint: define the measurement and calculation; scale (binary, categorical, ordinal, continuous, time-to-event) and single vs repeated measure; the statistical model (e.g. ANCOVA, MMRM, logistic regression, Cox model) with covariates and factors; how results are presented (LS means with SE, treatment difference with 95% CI, odds/hazard ratios); assumption checks; analysis population; handling of missing data (with justification), outliers, non-adherence and loss to follow-up, plus sensitivity analyses; Type I error control if more than one primary endpoint."
            },
            {
              "id": "9.4.3",
              "number": "9.4.3",
              "title": "Analysis of the Secondary Endpoint(s)",
              "level": 3,
              "headingOnly": false,
              "prompt": "For each secondary endpoint (grouping endpoints with the same analytic approach): definition, scale, statistical method, covariates, presentation of results, assumption checks, population, missing data handling, and multiplicity control strategy (e.g. fixed-sequence or Hochberg) if claims are sought."
            },
            {
              "id": "9.4.4",
              "number": "9.4.4",
              "title": "Safety Analyses",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe safety analyses on the Safety Analysis Set: treatment-emergent AE definition; AE summaries by MedDRA SOC and preferred term, by severity and relationship; SAEs, deaths and AEs leading to discontinuation; laboratory values, vital signs and ECGs as summary statistics, change from baseline and shift tables; exposure and compliance summaries. If a formal safety endpoint exists, apply the elements of Section 9.4.2."
            },
            {
              "id": "9.4.5",
              "number": "9.4.5",
              "title": "Baseline Descriptive Statistics",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, describe comparison of intervention groups on baseline demographics, disease characteristics and laboratory measures using descriptive statistics, and state whether inferential tests will be used (generally not for randomized comparisons). Otherwise state 'Not applicable.'"
            },
            {
              "id": "9.4.6",
              "number": "9.4.6",
              "title": "Planned Interim Analyses",
              "level": 3,
              "headingOnly": false,
              "prompt": "If applicable, describe each interim analysis: purpose (efficacy, futility, safety), timing (information fraction or number of participants/events), stopping boundaries (e.g. O'Brien-Fleming via Lan-DeMets alpha spending), who performs and reviews it (unblinded statistician, DSMB), measures to protect trial integrity, any sample size re-estimation algorithm, and Type I error control. Otherwise state 'Not applicable.'"
            },
            {
              "id": "9.4.7",
              "number": "9.4.7",
              "title": "Sub-Group Analyses",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe planned subgroup analyses of primary and secondary endpoints by age, sex, race/ethnicity and other pre-specified factors (including stratification factors), methods (treatment-by-subgroup interaction tests, forest plots), and that they are exploratory; or justify why such analyses are not warranted."
            },
            {
              "id": "9.4.8",
              "number": "9.4.8",
              "title": "Tabulation of Individual Participant Data",
              "level": 3,
              "headingOnly": false,
              "prompt": "State whether individual participant data will be listed by measure, participant and timepoint, and which listings will be produced."
            },
            {
              "id": "9.4.9",
              "number": "9.4.9",
              "title": "Exploratory Analyses",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe each planned exploratory analysis (exploratory endpoints from Section 3, biomarker or PK analyses) and methods, and state that results are hypothesis-generating and not confirmatory."
            }
          ]
        }
      ]
    },
    {
      "id": "10",
      "number": "10",
      "title": "SUPPORTING DOCUMENTATION AND OPERATIONAL CONSIDERATIONS",
      "level": 1,
      "headingOnly": true,
      "children": [
        {
          "id": "10.1",
          "number": "10.1",
          "title": "Regulatory, Ethical, and Study Oversight Considerations",
          "level": 2,
          "headingOnly": true,
          "children": [
            {
              "id": "10.1.1",
              "number": "10.1.1",
              "title": "Informed Consent Process",
              "level": 3,
              "headingOnly": false,
              "prompt": "Open with whether a separate screening consent is used. Then write two subheadings. Consent/Assent and Other Informational Documents Provided to Participants: the consent form(s), assent forms for minors if applicable, and any special materials (other languages, Braille, audio). Consent Procedures and Documentation: who obtains consent, that consent is obtained before any study procedures, adequate time to consider and discuss with family, opportunity for questions, comprehension checks, signature and dating, copy given to participant, documentation in source records, consent for non-English speakers (translated forms or short form with interpreter), surrogate/LAR consent and assent, any waivers or alterations requested, and re-consent when new information or amendments arise."
            },
            {
              "id": "10.1.2",
              "number": "10.1.2",
              "title": "Study Discontinuation and Closure",
              "level": 3,
              "headingOnly": false,
              "prompt": "List reasons for termination or temporary suspension (decision of PI, sponsor, funder, IRB or FDA; unexpected, significant or unacceptable risk; insufficient compliance with the protocol; incomplete or unevaluable data; futility; efficacy demonstrated). Describe written notification to participants, investigators, IRB, funder, IND/IDE sponsor and regulators with reasons, the obligation to inform participants promptly and arrange follow-up, and conditions for resumption with IRB/FDA approval. Refer to Section 7 for handling of enrolled participants."
            },
            {
              "id": "10.1.3",
              "number": "10.1.3",
              "title": "Confidentiality and Privacy",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe protections for participant confidentiality and privacy: coding of data and samples with participant IDs, secure storage of records and key codes, access limited to authorized personnel (study staff, monitors, sponsor, IRB, regulators), electronic data security (encryption, access controls, audit trails), handling under HIPAA/GDPR or local law as applicable, release of information only with written permission, and the NIH Certificate of Confidentiality where applicable."
            },
            {
              "id": "10.1.4",
              "number": "10.1.4",
              "title": "Future Use of Stored Specimens and Data",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe what specimens and data will be stored for future research, consent options (opt-in/opt-out), storage location and responsible party, coding/de-identification, retention period, access and approval process, data sharing repositories, return of results policy, and how participants can withdraw consent and request destruction. Refer to Sections 10.1.3 and 10.1.9."
            },
            {
              "id": "10.1.5",
              "number": "10.1.5",
              "title": "Key Roles and Study Governance",
              "level": 3,
              "headingOnly": false,
              "prompt": "Provide a Markdown table with name, degree, title, institution, address, phone and email for the Principal Investigator and the Medical Monitor (use placeholders). Briefly describe leadership committees (e.g. Steering Committee, Executive Committee, Publications Committee) and their roles without listing members, and any country-specific administrative requirements."
            },
            {
              "id": "10.1.6",
              "number": "10.1.6",
              "title": "Safety Oversight",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe safety oversight: the body (DSMB, SMC, Safety Assessment Committee or Independent Safety Monitor), composition, expertise and independence from the study team, conflict of interest requirements, governing charter, meeting frequency (organizational, periodic, ad hoc), open and closed sessions, data reviewed (accrual, AEs, SAEs, efficacy if applicable), and how recommendations are communicated to the sponsor, funder and IRB."
            },
            {
              "id": "10.1.7",
              "number": "10.1.7",
              "title": "Clinical Monitoring",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe monitoring: purpose (participant rights and safety, data accuracy, protocol/GCP compliance), who monitors (sponsor, CRO), approach (risk-based, on-site, remote, centralized), frequency and extent including source data verification percentage, site initiation and close-out visits, Clinical Monitoring Plan reference, distribution of monitoring reports, and independent audits."
            },
            {
              "id": "10.1.8",
              "number": "10.1.8",
              "title": "Quality Assurance and Quality Control",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe the quality management system: site QC SOPs, staff training and delegation logs, data QC (electronic edit checks, query resolution), laboratory QA and accreditation, documentation of deficiencies and corrective/preventive actions, and the requirement that sites provide direct access to source data and documents for monitoring, audits, IRB review and regulatory inspection."
            },
            {
              "id": "10.1.9",
              "number": "10.1.9",
              "title": "Data Handling and Record Keeping",
              "level": 3,
              "headingOnly": false,
              "prompt": "Open with a statement that sites maintain medical and research records per ICH GCP and regulatory requirements and permit authorized access. Then write two subheadings. Data Collection and Management Responsibilities: paper or electronic CRFs, EDC system (21 CFR Part 11 compliant), data standards (e.g. CDISC), definition and examples of source documents, investigator responsibility for accuracy, completeness and timeliness (data entry within x days), data management by the coordinating center, coding dictionaries (MedDRA, WHODrug), and database lock. Study Records Retention: retention period per the most conservative applicable rule (e.g. at least 2 years after the last marketing application approval or after formal discontinuation of clinical development, or as required by funder/local law), and that records are not destroyed without written sponsor agreement."
            },
            {
              "id": "10.1.10",
              "number": "10.1.10",
              "title": "Protocol Deviations",
              "level": 3,
              "headingOnly": false,
              "prompt": "Define a protocol deviation (any noncompliance with the protocol, ICH GCP or MOP requirements) and important/major vs minor deviations. Describe site responsibility to identify, document within x working days of identification, and report deviations to the sponsor and IRB per their requirements; the statement that deviations are not allowed unless pre-approved where permitted; corrective and preventive actions; and inclusion in study reports."
            },
            {
              "id": "10.1.11",
              "number": "10.1.11",
              "title": "Publication and Data Sharing Policy",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe publication and authorship policy (e.g. ICMJE criteria, publications committee), registration and results reporting on ClinicalTrials.gov per FDAAA 801 and the NIH dissemination policy, NIH Public Access Policy (PubMed Central submission), and data sharing per the NIH Data Management and Sharing Policy (what data, when, which repository, access controls). Verify current policy requirements."
            },
            {
              "id": "10.1.12",
              "number": "10.1.12",
              "title": "Conflict of Interest Policy",
              "level": 3,
              "headingOnly": false,
              "prompt": "Describe how actual or perceived conflicts of interest are managed: disclosure requirements for all persons with a role in design, conduct, analysis, publication or oversight; review and management by the institutional or study conflict of interest committee; and that management plans are in place before participation."
            }
          ]
        },
        {
          "id": "10.2",
          "number": "10.2",
          "title": "Additional Considerations",
          "level": 2,
          "headingOnly": false,
          "prompt": "Describe any additional considerations not covered elsewhere (e.g. institutional or IRB-specific requirements, local regulatory requirements, emergency procedures). If none, state 'None.'"
        },
        {
          "id": "10.3",
          "number": "10.3",
          "title": "Abbreviations",
          "level": 2,
          "headingOnly": false,
          "prompt": "Create an alphabetical two-column Markdown table (Abbreviation | Definition) containing every abbreviation actually used in this protocol, and no unused ones."
        },
        {
          "id": "10.4",
          "number": "10.4",
          "title": "Protocol Amendment History",
          "level": 2,
          "headingOnly": false,
          "prompt": "Create a Markdown table with columns Version | Date | Description of Change | Brief Rationale. For an original protocol, include one row for Version 1.0 with 'Original protocol'."
        }
      ]
    },
    {
      "id": "11",
      "number": "11",
      "title": "REFERENCES",
      "level": 1,
      "headingOnly": false,
      "prompt": "Create a numbered reference list of every publication cited in the protocol text, in citation order, using a consistent standard format (ICMJE/Vancouver). Include only real, verifiable references supplied in the study context; for any citation that cannot be verified, insert '[REFERENCE TO BE VERIFIED]' rather than inventing details."
    }
  ]
}