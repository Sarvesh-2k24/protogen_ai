/**
 * Protocol Structure Definitions mirroring the
 * NIH-FDA Phase 2 and 3 IND/IDE Clinical Trial Protocol Template (30 July 2023 version supplied).
 *
 * Section numbering, titles and order match the template Table of Contents exactly.
 * Fields:
 *   level        - heading depth (1 = section, 2 = x.x, 3 = x.x.x, 4 = x.x.x.x)
 *   headingOnly  - true where the template says "No text is to be entered in this section";
 *                  render the heading only, do not generate body text.
 *   optional     - true where the template says "Include content if applicable, otherwise note as not-applicable".
 */

const PROTOCOL_SECTIONS = [
    {
        id: 'section-0',
        stepNumber: 1,
        title: 'Title Page and Statement of Compliance',
        description: 'Title page, protocol identifiers, version control, summary of changes, and statement of compliance (unnumbered front matter).',
        subsections: [
            { id: '0.1', level: 2, title: 'Title Page', promptHint: 'Full protocol title (brief, specific, neutral) and short title if any, Protocol Number, NCT Identified Number (if available), Principal Investigator, IND/IDE Sponsor name, Funded by (NIH Institute or Center), Version Number v.x.x, version date in international format (DD Month YYYY, e.g. 23 June 2015)' },
            { id: '0.2', level: 2, title: 'Summary of Changes from Previous Version', promptHint: 'Markdown table with columns: Affected Section(s) | Summary of Revisions Made | Rationale. State "Not applicable - original version" for version 1.0' },
            { id: '0.3', level: 2, title: 'Statement of Compliance', promptHint: 'Statement that the trial will be conducted per the protocol, ICH GCP and applicable US CFR (45 CFR 46, 21 CFR 50, 56, 312 and/or 812); investigators and staff completed Human Subjects Protection and ICH GCP training; protocol, ICF, recruitment and participant materials submitted to IRB; approval required before enrolment; amendments require IRB review/approval and re-consent where applicable; engaged institutions hold a current Federal-Wide Assurance (FWA)' }
        ]
    },
    {
        id: 'section-1',
        stepNumber: 2,
        title: '1 PROTOCOL SUMMARY',
        description: 'Synopsis, study schema, and schedule of activities. No text directly under the section heading.',
        subsections: [
            { id: '1.1', level: 2, title: '1.1 Synopsis', promptHint: 'Two-column Markdown table with rows: Title; Study Description (short description incl. brief hypothesis statement); Objectives (Primary Objective, Secondary Objectives, aligned with ClinicalTrials.gov Primary Purpose); Endpoints (Primary Endpoint, Secondary Endpoints, aligned with ClinicalTrials.gov Outcome Measures); Study Population (sample size, gender, age, demographic group, general health status, geographic location); Phase (2 or 3); Description of Sites/Facilities Enrolling Participants (number of sites, US/international); Description of Study Intervention (dose, route; for devices, components); Study Duration (months from enrolment open to completion of analyses); Participant Duration (time per participant to complete all visits)' },
            { id: '1.2', level: 2, title: '1.2 Schema', promptHint: 'One-page flow diagram in Mermaid format snapshot of study design: prior to enrolment (screening, total N), randomization/allocation to arms with N per arm, intervention period, timepoints of in-clinic visits and telephone contacts, follow-up, and primary/secondary endpoint assessment timepoints' },
            { id: '1.3', level: 2, title: '1.3 Schedule of Activities (SoA)', promptHint: 'Markdown matrix table: columns = Screening (Day -x to -1), Enrolment/Baseline (Day 1), each study visit with day and visit window (+/- days), telephone contacts, Final Visit/Early Termination; rows = informed consent, demographics, medical history, randomization, study intervention administration, concomitant medication review, physical exam, vital signs, height/weight, hematology, chemistry, biochemistry, pregnancy test, urinalysis, other assays, AE review and evaluation, SAE review, CRF completion; mark X per visit; include footnotes' }
        ]
    },
    {
        id: 'section-2',
        stepNumber: 3,
        title: '2 INTRODUCTION',
        description: 'Study rationale, background, and risk/benefit assessment.',
        subsections: [
            { id: '2.1', level: 2, title: '2.1 Study Rationale', promptHint: 'State the problem or question: population, disease, current standard of care and its limitations, gaps in knowledge or available therapy, and the reason for conducting the clinical trial' },
            { id: '2.2', level: 2, title: '2.2 Background', promptHint: 'Summary of nonclinical in vitro/in vivo findings of clinical significance; relevant clinical research and history of human use/exposure incl. other countries and clinical pharmacology studies; important literature and data (cite in Section 11 References); clinical, epidemiological or public health context; importance of the trial and relevant treatment issues or controversies' },
            { id: '2.3', level: 2, headingOnly: true, title: '2.3 Risk/Benefit Assessment', promptHint: 'Heading only' },
            { id: '2.3.1', level: 3, title: '2.3.1 Known Potential Risks', promptHint: 'Known potential risks from clinical or nonclinical studies (IB or package insert/device labeling as primary source); physical, psychological, social, legal, economic or other risks of participation; immediate vs long-range risks; risks of study procedures (e.g. blood draws, imaging); likelihood and seriousness; steps to minimize risks' },
            { id: '2.3.2', level: 3, title: '2.3.2 Known Potential Benefits', promptHint: 'Known potential benefits from clinical or nonclinical studies (IB or package insert as primary source); physical, psychological, social or other benefits to individual participants or society; immediate vs long-range benefits; state if no direct benefit is expected' },
            { id: '2.3.3', level: 3, title: '2.3.3 Assessment of Potential Risks and Benefits', promptHint: 'Rationale for necessity of exposing participants to risks; summary of measures to minimize risks and maximize benefits; why risks are reasonable relative to anticipated benefits; alternative treatments available to participants' }
        ]
    },
    {
        id: 'section-3',
        stepNumber: 4,
        title: '3 OBJECTIVES AND ENDPOINTS',
        description: 'Objectives and endpoints in a single table, aligned with ClinicalTrials.gov Primary Purpose and Outcome Measures.',
        subsections: [
            { id: '3', level: 1, title: '3 OBJECTIVES AND ENDPOINTS', promptHint: 'Brief intro on objectives (statement of purpose: to assess, determine, compare, evaluate efficacy/safety) and endpoints (specific measurement/observation, prioritized, adjusted for multiplicity). Then a 3-column Markdown table: OBJECTIVES | ENDPOINTS | JUSTIFICATION FOR ENDPOINTS, with row groups Primary, Secondary, Tertiary/Exploratory. Each endpoint must state the measurement, scale/instrument and timepoint' }
        ]
    },
    {
        id: 'section-4',
        stepNumber: 5,
        title: '4 STUDY DESIGN',
        description: 'Overall design, scientific rationale, dose justification, and end of study definition. No text directly under the section heading.',
        subsections: [
            { id: '4.1', level: 2, title: '4.1 Overall Design', promptHint: 'Consistent with Synopsis (1.1) and Schema (1.2): statement of hypothesis; phase; type/design (randomized, placebo-controlled, double-blinded, parallel, open-label, dose-ranging, adaptive, superiority/non-inferiority etc.); methods to minimize bias; number of arms and intervention duration; single or multi-site; name of study intervention(s); note planned interim analysis (refer to 9.4.6); stratifications (refer to 9.4.7); sub-studies' },
            { id: '4.2', level: 2, title: '4.2 Scientific Rationale for Study Design', promptHint: 'Rationale for type and selection of control (placebo, active, dose-response, historical) and study design (e.g. non-inferiority vs superiority); known or potential problems with the chosen control group for this disease and intervention; justification of key design features' },
            { id: '4.3', level: 2, title: '4.3 Justification for Dose', promptHint: 'Justification for route of administration, planned maximum dosage, dosing regimen and starting dose of study intervention(s) and control product(s), referencing prior nonclinical and clinical (Phase 1/2) data' },
            { id: '4.4', level: 2, title: '4.4 End of Study Definition', promptHint: 'Define participant completion (completed all phases incl. last visit / last scheduled procedure in SoA) and end of study (last participant last visit or last scheduled procedure shown in SoA)' }
        ]
    },
    {
        id: 'section-5',
        stepNumber: 6,
        title: '5 STUDY POPULATION',
        description: 'Eligibility criteria, lifestyle considerations, screen failures, recruitment and retention. No text directly under the section heading.',
        subsections: [
            { id: '5.1', level: 2, title: '5.1 Inclusion Criteria', promptHint: 'Numbered list: "In order to be eligible to participate in this study, an individual must meet all of the following criteria:" provision of signed and dated ICF; stated willingness to comply with all procedures and availability for duration; age range; diagnosis with specific diagnostic criteria; disease duration/severity; specific laboratory thresholds; ability to take study intervention and willingness to adhere to regimen; contraception requirements for participants of reproductive potential; agreement to lifestyle considerations. Do not duplicate any criterion in exclusion list' },
            { id: '5.2', level: 2, title: '5.2 Exclusion Criteria', promptHint: 'Numbered list: "An individual who meets any of the following criteria will be excluded from participation in this study:" current use of prohibited medications; pregnancy or lactation; known allergic reactions to components of study intervention; febrile illness within x days; treatment with another investigational drug within x days; comorbidities, hepatic/renal impairment limits; plus a statement on equitable selection or justification for excluding specific populations' },
            { id: '5.3', level: 2, title: '5.3 Lifestyle Considerations', promptHint: 'Restrictions on diet, timing of meals relative to dosing, caffeine, alcohol, tobacco, activity limits, household contact considerations; actions taken if prohibited medications or activities occur; example: refrain from consumption of x from y hours before start of dosing until after final dose' },
            { id: '5.4', level: 2, title: '5.4 Screen Failures', promptHint: 'Definition: participants who consent but are not subsequently randomly assigned or entered; minimal screen failure data collected for CONSORT reporting (demography, screen failure details, eligibility criteria, SAEs); rescreening policy for modifiable factors with same participant number' },
            { id: '5.5', level: 2, title: '5.5 Strategies for Recruitment and Retention', promptHint: 'Target sample size by gender, race, ethnicity and age; anticipated number screened; accrual rate; number of sites and US vs non-US enrolment; source of participants; recruitment venues; how participants are identified and approached; recruitment strategies; retention procedures for long-term participation; strategies for under-represented populations (NIH inclusion policy); justification for vulnerable participants; participant compensation/incentives amount, form and timing' }
        ]
    },
    {
        id: 'section-6',
        stepNumber: 7,
        title: '6 STUDY INTERVENTION',
        description: 'Study intervention and control product description, dosing, handling, randomization/blinding, compliance, and concomitant therapy.',
        subsections: [
            { id: '6', level: 1, title: '6 STUDY INTERVENTION (introductory text)', promptHint: 'Short intro identifying the study intervention(s) (drug, biologic, imaging agent or device under IND/IDE) and control product; if multiple interventions, note that 6.1 and 6.2 differentiate each product' },
            { id: '6.1', level: 2, headingOnly: true, title: '6.1 Study Intervention(s) Administration', promptHint: 'Heading only' },
            { id: '6.1.1', level: 3, title: '6.1.1 Study Intervention Description', promptHint: 'Describe study intervention(s) and control product using IB, package insert or device labeling: name, formulation, strength, mechanism of action, regulatory status (IND/IDE number, approved vs investigational), matching placebo description' },
            { id: '6.1.2', level: 3, title: '6.1.2 Dosing and Administration', promptHint: 'Procedures for selecting each participant\'s dose; timing (time of day, interval), duration, route of administration, starting dose and schedule, dose escalation/titration, dose adjustments, max and min duration; instructions relative to meals; procedures for missed doses' },
            { id: '6.2', level: 2, headingOnly: true, title: '6.2 Preparation/Handling/Storage/Accountability', promptHint: 'Heading only' },
            { id: '6.2.1', level: 3, title: '6.2.1 Acquisition and accountability', promptHint: 'How intervention and control are provided to the investigator; distribution (repository/pharmacy); accountability logs; disposal of expired or return of unused product' },
            { id: '6.2.2', level: 3, title: '6.2.2 Formulation, Appearance, Packaging, and Labeling', promptHint: 'Formulation, appearance, packaging and labeling as supplied; manufacturer name; investigational labeling ("Caution: New Drug - Limited by Federal (or United States) law to investigational use"); blinded labeling if applicable' },
            { id: '6.2.3', level: 3, title: '6.2.3 Product Storage and Stability', promptHint: 'Storage and stability requirements: temperature range, protection from light, humidity, temperature monitoring and excursion handling; multi-dose vial stability and expiry after first use' },
            { id: '6.2.4', level: 3, title: '6.2.4 Preparation', promptHint: 'Preparation by study staff and/or participants: thawing, diluting, mixing, reconstitution instructions (or reference to MOP/SOP); device setup or calibration if applicable' },
            { id: '6.3', level: 2, title: '6.3 Measures to Minimize Bias: Randomization and Blinding', promptHint: 'Randomization method and allocation ratio, stratification factors, block sizes not disclosed; system used (e.g. IRT/web-based); blinding level and who is blinded; maintenance of randomization codes; planned and unplanned (emergency) unblinding procedures, criteria, who may unblind and how unblinding is documented and reported' },
            { id: '6.4', level: 2, title: '6.4 Study Intervention Compliance', promptHint: 'How adherence is assessed and verified (pill counts, returned vials, plasma assays, electronic monitoring, daily diaries); mandatory documents (participant drug log) and source documents; acceptable compliance range; actions for non-compliance' },
            { id: '6.5', level: 2, title: '6.5 Concomitant Therapy', promptHint: 'Consistent with eligibility restrictions: data recorded for permitted concomitant medications, supplements, complementary/alternative therapies, treatments and procedures; time period recorded (e.g. from x days before screening through end of study); prohibited medications and washout periods' },
            { id: '6.5.1', level: 3, optional: true, title: '6.5.1 Rescue Medicine', promptHint: 'If applicable: list of rescue medications/treatments/procedures, administration instructions, supply source, recording requirements; otherwise state "Not applicable"' }
        ]
    },
    {
        id: 'section-7',
        stepNumber: 8,
        title: '7 STUDY INTERVENTION DISCONTINUATION AND PARTICIPANT DISCONTINUATION/WITHDRAWAL',
        description: 'Criteria and procedures for intervention discontinuation, participant withdrawal, and lost to follow-up.',
        subsections: [
            { id: '7.1', level: 2, title: '7.1 Discontinuation of Study Intervention', promptHint: 'Criteria for discontinuing intervention (halting rules), monitoring tests and decision points; temporary discontinuation reasons and resumption criteria; statement that discontinuation of intervention does not mean discontinuation from study; follow-up of participants who stop intervention but remain in study; data collected at time of discontinuation' },
            { id: '7.2', level: 2, title: '7.2 Participant Discontinuation/Withdrawal from the Study', promptHint: 'Participants free to withdraw at any time; investigator reasons for withdrawal (pregnancy, significant non-compliance, AE/lab abnormality making continuation not in best interest, disease progression, newly met exclusion criterion, unable to receive intervention for x days); reason recorded on CRF; replacement policy; for implantable devices, information provided to withdrawn participants' },
            { id: '7.3', level: 2, title: '7.3 Lost to Follow-Up', promptHint: 'Definition (fails to return for x scheduled visits and cannot be contacted); actions: reschedule missed visit within x time frame and counsel on importance; every effort to regain contact (where possible 3 telephone calls and, if necessary, a certified letter), documented in medical record/study file; if still unreachable, considered withdrawn with primary reason lost to follow-up' }
        ]
    },
    {
        id: 'section-8',
        stepNumber: 9,
        title: '8 STUDY ASSESSMENTS AND PROCEDURES',
        description: 'Efficacy and safety assessments, adverse event definitions, classification and reporting, and unanticipated problems.',
        subsections: [
            { id: '8.1', level: 2, title: '8.1 Efficacy Assessments', promptHint: 'All procedures and evaluations supporting efficacy per primary and secondary objectives: screening sequence and eligibility decision points, procedures by visit, instruments/scales/imaging, who performs them, qualifications, central/blinded reading, standardization; capture rationale at final visit for early discontinuation (refer to Section 7)' },
            { id: '8.2', level: 2, title: '8.2 Safety and Other Assessments', promptHint: 'Procedures for safety and other purposes (screening, eligibility, enrolment): screening window (e.g. within 28 days prior to enrolment); physical exam, vital signs, height/weight, clinical laboratory tests (hematology, chemistry, urinalysis, pregnancy), ECG, imaging, biological specimen collection, handling and laboratory evaluations, counselling procedures; total blood volume drawn' },
            { id: '8.3', level: 2, headingOnly: true, title: '8.3 Adverse Events and Serious Adverse Events', promptHint: 'Heading only' },
            { id: '8.3.1', level: 3, title: '8.3.1 Definition of Adverse Events (AE)', promptHint: 'FDA definition per 21 CFR 312.32(a): any untoward medical occurrence associated with the use of an intervention in humans, whether or not considered intervention-related' },
            { id: '8.3.2', level: 3, title: '8.3.2 Definition of Serious Adverse Events (SAE)', promptHint: 'FDA definition per 21 CFR 312.32(a) (or 21 CFR 812.3(s) for devices): results in death, life-threatening AE, inpatient hospitalization or prolongation, persistent or significant incapacity, congenital anomaly/birth defect, or important medical event based on medical judgment' },
            { id: '8.3.3', level: 3, headingOnly: true, title: '8.3.3 Classification of an Adverse Event', promptHint: 'Heading only' },
            { id: '8.3.3.1', level: 4, title: '8.3.3.1 Severity of Event', promptHint: 'Protocol-defined grading system (e.g. Mild / Moderate / Severe or a named toxicity table such as CTCAE or DAIDS) with definitions; distinguish severity from seriousness' },
            { id: '8.3.3.2', level: 4, title: '8.3.3.2 Relationship to Study Intervention', promptHint: 'Causality assessment by study clinician based on temporal relationship and clinical judgment; categories (e.g. Related / Not Related, or Definitely, Probably, Potentially, Unlikely, Unrelated) with definitions' },
            { id: '8.3.3.3', level: 4, title: '8.3.3.3 Expectedness', promptHint: 'Who determines expectedness; reference safety information source (IB, package insert, device labeling); definition of unexpected AE per FDA' },
            { id: '8.3.4', level: 3, title: '8.3.4 Time Period and Frequency for Event Assessment and Follow-Up', promptHint: 'How AEs/SAEs are identified (solicited vs unsolicited), recorded on CRF, followed until resolved or stable; collection period (e.g. from ICF signature through x days after last dose); frequency of assessment; pre-existing conditions and changes recorded; follow-up of events ongoing at study end' },
            { id: '8.3.5', level: 3, title: '8.3.5 Adverse Event Reporting', promptHint: 'Investigator responsibilities and timeframes for reporting AEs to sponsor, DSMB/safety monitoring committee, IRB; reference MOP/SOP and flow chart' },
            { id: '8.3.6', level: 3, title: '8.3.6 Serious Adverse Event Reporting', promptHint: 'Investigator reports all SAEs to sponsor immediately (per 21 CFR 312.64 / 812.150), timeframe (e.g. within 24 hours), forms and who signs off; follow-up reports; sponsor IND safety reporting (7-day/15-day) to FDA and investigators; device unanticipated adverse device effects reporting' },
            { id: '8.3.7', level: 3, optional: true, title: '8.3.7 Reporting Events to Participants', promptHint: 'If applicable: how participants are informed of AEs, SAEs and study results individually or in aggregate; management of incidental findings; otherwise "Not applicable"' },
            { id: '8.3.8', level: 3, optional: true, title: '8.3.8 Events of Special Interest', promptHint: 'If applicable: other events meriting reporting to sponsor, study leadership, IRB and regulators (e.g. secondary malignancies), with reporting timelines; otherwise "Not applicable"' },
            { id: '8.3.9', level: 3, optional: true, title: '8.3.9 Reporting of Pregnancy', promptHint: 'If applicable: pregnancy is not an AE; policy and reporting procedures to sponsor, IRB and regulators; discontinue intervention while continuing safety follow-up; follow pregnancy to outcome; otherwise "Not applicable"' },
            { id: '8.4', level: 2, headingOnly: true, title: '8.4 Unanticipated Problems', promptHint: 'Heading only' },
            { id: '8.4.1', level: 3, title: '8.4.1 Definition of Unanticipated Problems (UP)', promptHint: 'OHRP definition: any incident, experience or outcome that is unexpected in nature, severity or frequency; related or possibly related to participation; and suggests greater risk of harm than previously known' },
            { id: '8.4.2', level: 3, title: '8.4.2 Unanticipated Problem Reporting', promptHint: 'Investigator reports UPs to IRB and DCC/lead PI with required content (protocol identifiers, participant ID, description, assessment, corrective plan); timelines: UPs that are SAEs within x days of awareness, other UPs within x days, all UPs to OHRP within x days of IRB receipt' },
            { id: '8.4.3', level: 3, optional: true, title: '8.4.3 Reporting Unanticipated Problems to Participants', promptHint: 'If applicable: how participants are informed of UPs individually or in aggregate; otherwise "Not applicable"' }
        ]
    },
    {
        id: 'section-9',
        stepNumber: 10,
        title: '9 STATISTICAL CONSIDERATIONS',
        description: 'Hypotheses, sample size, analysis populations, and planned statistical analyses. No text directly under the section heading.',
        subsections: [
            { id: '9.1', level: 2, title: '9.1 Statistical Hypotheses', promptHint: 'Formal testable null and alternative hypotheses for primary and key secondary endpoints, type of comparison (superiority, equivalence, non-inferiority, dose response) and time period for each endpoint' },
            { id: '9.2', level: 2, title: '9.2 Sample Size Determination', promptHint: 'Numbers to recruit, screen and enrol; outcome measure used; test method; alpha (one/two-sided); power; assumed effect size and variability with sources; expected dropout/non-adherence inflation; calculations across a range of assumptions to show robustness; adjustments for interim analyses or multiplicity' },
            { id: '9.3', level: 2, title: '9.3 Populations for Analyses', promptHint: 'Define ITT (all randomized), Modified ITT, Safety Analysis Dataset (received at least one dose), Per-Protocol dataset, and other datasets for sensitivity analyses' },
            { id: '9.4', level: 2, headingOnly: true, title: '9.4 Statistical Analyses', promptHint: 'Heading only' },
            { id: '9.4.1', level: 3, title: '9.4.1 General Approach', promptHint: 'Descriptive statistics for categorical and continuous data; significance level, confidence intervals, one or two-tailed; whether covariates pre-specified here or in SAP; checks of assumptions (e.g. normality) and corrective procedures (transformation, nonparametric tests)' },
            { id: '9.4.2', level: 3, title: '9.4.2 Analysis of the Primary Efficacy Endpoint(s)', promptHint: 'For each primary endpoint: definition and calculation; scale and whether single or repeated measure; statistical procedure (e.g. ANCOVA, mixed models, logistic regression) with covariates/factors; presentation of results (LS means with SE, odds ratios with 95% CI); assumption checks; analysis populations (ref 9.3); handling of missing data, outliers, non-adherence and loss to follow-up; Type I error adjustment if more than one primary endpoint' },
            { id: '9.4.3', level: 3, title: '9.4.3 Analysis of the Secondary Endpoint(s)', promptHint: 'For each secondary endpoint: definition, scale, statistical procedure, covariates, presentation, assumption checks, populations, missing data handling, multiplicity adjustment' },
            { id: '9.4.4', level: 3, title: '9.4.4 Safety Analyses', promptHint: 'Summaries of AEs by SOC and preferred term, severity, relationship; SAEs; discontinuations due to AEs; lab and vital sign summaries, change from baseline and shift tables; if formal safety endpoint, apply all factors from 9.4.2' },
            { id: '9.4.5', level: 3, optional: true, title: '9.4.5 Baseline Descriptive Statistics', promptHint: 'If applicable: comparison of intervention groups on baseline demographics and laboratory measures using descriptive statistics; whether inferential statistics used; otherwise "Not applicable"' },
            { id: '9.4.6', level: 3, optional: true, title: '9.4.6 Planned Interim Analyses', promptHint: 'If applicable: type and timing of interim analyses (efficacy, futility, safety), halting guidelines and stopping boundaries, who reviews (DSMB), sample size re-estimation algorithm, Type I error control; otherwise "Not applicable"' },
            { id: '9.4.7', level: 3, title: '9.4.7 Sub-Group Analyses', promptHint: 'How primary and secondary endpoints will be analyzed by age, sex, race/ethnicity or other demographics, or justification why not warranted' },
            { id: '9.4.8', level: 3, title: '9.4.8 Tabulation of Individual Participant Data', promptHint: 'State whether individual participant data will be listed by measure and time point' },
            { id: '9.4.9', level: 3, title: '9.4.9 Exploratory Analyses', promptHint: 'Planned exploratory analyses (cannot serve as confirmatory proof), with methods specified' }
        ]
    },
    {
        id: 'section-10',
        stepNumber: 11,
        title: '10 SUPPORTING DOCUMENTATION AND OPERATIONAL CONSIDERATIONS',
        description: 'Regulatory, ethical and oversight considerations, additional considerations, abbreviations, and amendment history. No text directly under the section heading.',
        subsections: [
            { id: '10.1', level: 2, headingOnly: true, title: '10.1 Regulatory, Ethical, and Study Oversight Considerations', promptHint: 'Heading only' },
            { id: '10.1.1', level: 3, headingOnly: true, title: '10.1.1 Informed Consent Process', promptHint: 'Heading only (optionally one sentence stating whether a separate screening consent is used)' },
            { id: '10.1.1.1', level: 4, title: '10.1.1.1 Consent/Assent and Other Informational Documents Provided to Participants', promptHint: 'Consent forms describing intervention, procedures and risks provided before intervention; special documents or materials (Braille, other languages, audio)' },
            { id: '10.1.1.2', level: 4, title: '10.1.1.2 Consent Procedures and Documentation', promptHint: 'How consent is administered and by whom; time to consider; questions answered; signed copy given to participant; waivers or alterations; non-English speakers; surrogate/LAR consent and assent for those unable to consent; consent documented before any study procedures; re-consent on amendments' },
            { id: '10.1.2', level: 3, title: '10.1.2 Study Discontinuation and Closure', promptHint: 'Reasons for termination or temporary suspension (PI, sponsor, regulatory decision; unexpected significant or unacceptable risk; insufficient compliance; data not sufficiently complete/evaluable; futility); written notification to participants, investigators, funder, IND/IDE sponsor and regulators with reasons; resumption after concerns addressed with IRB/FDA approval; refer to Section 7 for enrolled participants' },
            { id: '10.1.3', level: 3, title: '10.1.3 Confidentiality and Privacy', promptHint: 'Protection of participant data, forms, records and samples; who has access (investigators, monitors, funders, IRB, regulators); coding/de-identification; data security; record retention; Certificate of Confidentiality statement (NIH-funded research automatically covered)' },
            { id: '10.1.4', level: 3, title: '10.1.4 Future Use of Stored Specimens and Data', promptHint: 'Consent options for future use of specimens, images and recordings; storage location(s), coding, access, retention period, withdrawal of consent and destruction; data sharing repositories; refer to 10.1.3 and 10.1.9' },
            { id: '10.1.5', level: 3, title: '10.1.5 Key Roles and Study Governance', promptHint: 'Two-column table with name, degree, title, institution, address, phone, email of Principal Investigator and Medical Monitor; brief description of leadership committees (Steering, Executive) and roles; country-specific administrative requirements' },
            { id: '10.1.6', level: 3, title: '10.1.6 Safety Oversight', promptHint: 'Type of safety oversight (SMC, DSMB, Safety Assessment Committee, Independent Safety Monitor), composition and independence, meeting frequency, data reviewed, charter, recommendations to sponsor/funder' },
            { id: '10.1.7', level: 3, title: '10.1.7 Clinical Monitoring', promptHint: 'Who conducts monitoring; type (on-site, remote, risk-based), frequency and extent; percentage of source document verification; Clinical Monitoring Plan reference; distribution of monitoring reports; independent audits' },
            { id: '10.1.8', level: 3, title: '10.1.8 Quality Assurance and Quality Control', promptHint: 'Quality management plan; site SOPs; QC of data (training, checks, data queries via electronic edit checks); QA of laboratory processes; direct access to source data and documents for monitoring, audits and inspections' },
            { id: '10.1.9', level: 3, headingOnly: true, title: '10.1.9 Data Handling and Record Keeping', promptHint: 'Heading only (optionally one sentence on maintaining records per ICH GCP and allowing access to authorized representatives)' },
            { id: '10.1.9.1', level: 4, title: '10.1.9.1 Data Collection and Management Responsibilities', promptHint: 'Type of data capture (paper/electronic, EDC system, 21 CFR Part 11 compliance), data standards/CDEs; source documents definition and examples; investigator responsibility for accuracy and completeness; data entry timelines; clinical data managed by data coordinating center' },
            { id: '10.1.9.2', level: 4, title: '10.1.9.2 Study Records Retention', promptHint: 'Retention period using most conservative rule (e.g. at least 2 years after last marketing application approval or after formal discontinuation of clinical development, NIH 3 years from final financial report); permission required from IND/IDE sponsor before destruction' },
            { id: '10.1.10', level: 3, title: '10.1.10 Protocol Deviations', promptHint: 'Definition of deviation (non-compliance with protocol, ICH GCP or MOP); site responsibility to identify, document (within x working days) and report to sponsor and IRB per IRB requirements; deviations not allowed unless covered by investigator agreement; corrective actions' },
            { id: '10.1.11', level: 3, title: '10.1.11 Publication and Data Sharing Policy', promptHint: 'Publication and authorship policy; adherence to NIH Public Access Policy (PubMed Central); registration and results reporting on ClinicalTrials.gov per FDAAA and NIH policy; NIH Data Management and Sharing Policy, timelines and repositories' },
            { id: '10.1.12', level: 3, title: '10.1.12 Conflict of Interest Policy', promptHint: 'How actual or perceived conflicts of interest are managed; disclosure requirements for persons with design, conduct or reporting roles; review by institutional conflict of interest committee' },
            { id: '10.2', level: 2, title: '10.2 Additional Considerations', promptHint: 'Any additional considerations not covered elsewhere, e.g. particular institutional or IRB requirements; otherwise "None"' },
            { id: '10.3', level: 2, title: '10.3 Abbreviations', promptHint: 'Two-column alphabetical Markdown table of abbreviations used in this protocol (remove unused ones, add new ones)' },
            { id: '10.4', level: 2, title: '10.4 Protocol Amendment History', promptHint: 'Markdown table with columns: Version | Date | Description of Change | Brief Rationale, for IRB-approved versions' }
        ]
    },
    {
        id: 'section-11',
        stepNumber: 12,
        title: '11 REFERENCES',
        description: 'Literature cited in the protocol in a consistent standard format.',
        subsections: [
            { id: '11', level: 1, title: '11 REFERENCES', promptHint: 'Numbered list of all publications cited in the protocol text, in a consistent format (ICMJE / Vancouver preferred). Use only real, verifiable references; insert placeholders where a citation is required but unknown' }
        ]
    }
];

module.exports = {
    PROTOCOL_SECTIONS
};