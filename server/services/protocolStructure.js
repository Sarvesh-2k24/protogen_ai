/**
 * Protocol Structure Definitions adhering to ICH M11 Harmonized Protocol Template
 * and SPIRIT (Standard Protocol Items: Recommendations for Interventional Trials)
 */

const PROTOCOL_SECTIONS = [
  {
    id: 'section-1',
    stepNumber: 1,
    title: '1. Protocol Summary',
    description: 'Executive clinical overview, trial schema diagram, and schedule of activities (SoA).',
    subsections: [
      { id: '1.1', title: '1.1 Synopsis', promptHint: 'Protocol title, phase, indication, population, intervention, duration, primary & key secondary objectives' },
      { id: '1.2', title: '1.2 Trial Schema (Diagram)', promptHint: 'Flow diagram of study periods: Screening, Randomization, Treatment arms, Follow-up in Mermaid format' },
      { id: '1.3', title: '1.3 Schedule of Activities (Visit Table)', promptHint: 'Markdown matrix table mapping visits (Screening, Baseline, Wk 4, 12, 24, 52, Safety Follow-up) against procedures' }
    ]
  },
  {
    id: 'section-2',
    stepNumber: 2,
    title: '2. Introduction',
    description: 'Disease background, unmet medical need, mechanism of action, and benefit-risk assessment.',
    subsections: [
      { id: '2.1', title: '2.1 Purpose of the Trial and Background', promptHint: 'Pathophysiology of disease, current standard of care limitations, nonclinical and prior clinical data' },
      { id: '2.2', title: '2.2 Benefit-Risk Assessment', promptHint: 'Anticipated clinical benefits, identified and potential risks, and risk mitigation strategies' }
    ]
  },
  {
    id: 'section-3',
    stepNumber: 3,
    title: '3. Objectives, Endpoints and Estimands',
    description: 'Primary, secondary, and exploratory objectives aligned with ICH E9(R1) estimand framework.',
    subsections: [
      { id: '3.1', title: '3.1 Primary Objective, Endpoint, Estimand', promptHint: 'Primary efficacy/safety objective, exact measurement variable, timeframe, population, intercurrent event handling strategy' },
      { id: '3.2', title: '3.2 Secondary Objectives and Endpoints', promptHint: 'Key secondary clinical, functional, and safety endpoints with measurement methods' },
      { id: '3.3', title: '3.3 Exploratory Objectives', promptHint: 'Exploratory biomarker, pharmacogenomic, quality of life, and health economic endpoints' }
    ]
  },
  {
    id: 'section-4',
    stepNumber: 4,
    title: '4. Trial Design',
    description: 'Trial architecture, randomization, blinding, controls, arm definitions, and milestone dates.',
    subsections: [
      { id: '4.1', title: '4.1 Overall Design', promptHint: 'Phase, parallel/crossover, randomization ratio, blinding (double-blind/open-label), comparator control, treatment duration' },
      { id: '4.2', title: '4.2 Rationale for Design, Comparator, and Dose', promptHint: 'Justification of comparator/placebo, dose selection from Phase 1/2, dosing interval' },
      { id: '4.3', title: '4.3 Access to Intervention After Trial End', promptHint: 'Post-trial access, open-label extension (OLE), or transition to standard commercial care' },
      { id: '4.4', title: '4.4 Start and End of Trial Definitions', promptHint: 'Definitions of first subject first visit (FSFV) and last subject last visit (LSLV)' }
    ]
  },
  {
    id: 'section-5',
    stepNumber: 5,
    title: '5. Trial Population',
    description: 'Target patient population, inclusion/exclusion criteria, lifestyle restrictions, and screen failure handling.',
    subsections: [
      { id: '5.1', title: '5.1 Selection Rationale', promptHint: 'Demographic and disease severity justification for target patient cohort' },
      { id: '5.2', title: '5.2 Inclusion Criteria', promptHint: 'Age range, diagnostic criteria, disease duration, laboratory baseline thresholds, informed consent' },
      { id: '5.3', title: '5.3 Exclusion Criteria', promptHint: 'Medical comorbidities, contraindications, prohibited prior therapies, hepatic/renal impairment limits' },
      { id: '5.4', title: '5.4 Lifestyle Restrictions', promptHint: 'Dietary, alcohol, smoking, vigorous exercise, and contraception/pregnancy requirements' },
      { id: '5.5', title: '5.5 Screen Failures', promptHint: 'Definition of screen failure, re-screening policy, and required documentation' }
    ]
  },
  {
    id: 'section-6',
    stepNumber: 6,
    title: '6. Trial Intervention and Concomitant Therapy',
    description: 'IMP specifications, dosing regimens, storage, packaging, blinding maintenance, compliance, and rescue medications.',
    subsections: [
      { id: '6.1', title: '6.1 Description of Intervention(s)', promptHint: 'Investigational drug formulation, strength, packaging, manufacturer, and matching placebo' },
      { id: '6.2', title: '6.2 Dosing and Administration', promptHint: 'Route (oral, SC, IV), starting dose, titration schedule, dosing instructions relative to meals' },
      { id: '6.3', title: '6.3 Preparation, Handling, Storage, Accountability', promptHint: 'Storage temperature (e.g. 2-8°C or 15-25°C), reconstitution steps, drug return and pill counting' },
      { id: '6.4', title: '6.4 Assignment, Randomization, Blinding and Unblinding', promptHint: 'Interactive Response Technology (IRT/IWRS), stratification factors, emergency unblinding codes' },
      { id: '6.5', title: '6.5 Compliance', promptHint: 'Assessment of compliance (e.g. >= 80% and <= 120%), diaries, returned vials' },
      { id: '6.6', title: '6.6 Dose Modification', promptHint: 'Dose withholding, reduction rules for toxicities (Grade 3/4 AEs), re-escalation rules' },
      { id: '6.7', title: '6.7 Overdose', promptHint: 'Overdose definition, immediate clinical management, antidote or supportive measures, reporting' },
      { id: '6.8', title: '6.8 Concomitant and Rescue Therapy', promptHint: 'Permitted baseline therapies, prohibited medications (washout periods), and standardized rescue protocols' }
    ]
  },
  {
    id: 'section-7',
    stepNumber: 7,
    title: '7. Discontinuation and Withdrawal',
    description: 'Criteria for treatment discontinuation vs. study withdrawal, retention strategies, and lost-to-follow-up protocols.',
    subsections: [
      { id: '7.1', title: '7.1 Discontinuation of Trial Intervention', promptHint: 'Reasons to stop study drug while continuing safety follow-up (e.g., toxicity, pregnancy, investigator judgment)' },
      { id: '7.2', title: '7.2 Participant Withdrawal from Trial', promptHint: 'Withdrawal of consent, procedures at withdrawal visit, data collection for withdrawn participants' },
      { id: '7.3', title: '7.3 Lost to Follow-up', promptHint: 'Actions to contact participants: minimum 3 documented phone calls, certified letter prior to declaration' }
    ]
  },
  {
    id: 'section-8',
    stepNumber: 8,
    title: '8. Trial Assessments and Procedures',
    description: 'Detailed clinical, efficacy, safety, pharmacokinetics (PK), biomarkers, and resource utilization protocols.',
    subsections: [
      { id: '8.1', title: '8.1 Screening and Baseline', promptHint: 'Informed consent timing, medical history, physical examination, baseline diagnostic tests' },
      { id: '8.2', title: '8.2 Efficacy Assessments', promptHint: 'Primary & secondary outcome measurement instruments (imaging, clinical scales, functional tests, blinded central review)' },
      { id: '8.3', title: '8.3 Safety Assessments', promptHint: 'Vital signs, 12-lead ECG (QTcF intervals), routine hematology, chemistry, urinalysis, suicidality (C-SSRS)' },
      { id: '8.4', title: '8.4 Pharmacokinetics (PK)', promptHint: 'Blood sampling time points (pre-dose, 1h, 2h, 4h, trough), plasma processing, storage at -80°C, bioanalytical assay' },
      { id: '8.5', title: '8.5 Pharmacodynamics and Biomarkers', promptHint: 'Target engagement markers, soluble biomarkers, mechanistic exploratory panels' },
      { id: '8.6', title: '8.6 Immunogenicity and Genetics', promptHint: 'Anti-drug antibody (ADA) screening, neutralizing antibodies (NAb), optional pharmacogenomic consent' },
      { id: '8.7', title: '8.7 Medical Resource Utilization', promptHint: 'Hospitalizations, ICU days, emergency room visits, physician visits for health economics' }
    ]
  },
  {
    id: 'section-9',
    stepNumber: 9,
    title: '9. Safety Reporting',
    description: 'Adverse event definitions, grading scales (CTCAE), causality assessment, SUSAR reporting, and pregnancy registries.',
    subsections: [
      { id: '9.1', title: '9.1 Definitions (AE, SAE, AESI)', promptHint: 'ICH E2A definitions of Adverse Event, Serious Adverse Event, Adverse Event of Special Interest' },
      { id: '9.2', title: '9.2 Collection Timing and Methods', promptHint: 'AE recording from signing ICF through 30/90 days post-last dose, solicited vs unsolicited queries' },
      { id: '9.3', title: '9.3 Severity and Causality Assessment', promptHint: 'Mild / Moderate / Severe (or CTCAE Grade 1-5), Related vs Not Related classification' },
      { id: '9.4', title: '9.4 Reporting Timelines to Sponsor and Regulators', promptHint: 'SAE notification within 24 hours to Sponsor, 7-day/15-day SUSAR submission to FDA/EMA/IRBs' },
      { id: '9.5', title: '9.5 Pregnancy Reporting', promptHint: 'Immediate drug discontinuation, pregnancy reporting form within 24 hours, follow-up to outcome/delivery' },
      { id: '9.6', title: '9.6 Product Complaints', promptHint: 'Defective vial, pen malfunction, temperature excursion reporting protocol' }
    ]
  },
  {
    id: 'section-10',
    stepNumber: 10,
    title: '10. Statistical Considerations',
    description: 'Statistical hypotheses, sample size power calculations, analysis populations, and handling of intercurrent events.',
    subsections: [
      { id: '10.1', title: '10.1 Hypotheses', promptHint: 'Null (H0) and Alternative (H1) hypotheses for superiority or non-inferiority, alpha level (two-sided 0.05)' },
      { id: '10.2', title: '10.2 Sample Size Determination', promptHint: 'Effect size assumptions, standard deviation / hazard ratio, 80% or 90% power, drop-out inflation rate, total N' },
      { id: '10.3', title: '10.3 Analysis Sets', promptHint: 'ITT (Intent-to-Treat), mITT, Per-Protocol (PP), and Safety Population definitions' },
      { id: '10.4', title: '10.4 Primary, Secondary, and Exploratory Analyses', promptHint: 'Primary statistical model (ANCOVA, MMRM, Cox proportional hazards), covariate adjustments' },
      { id: '10.5', title: '10.5 Safety Analyses', promptHint: 'Descriptive summaries of TEAEs, SAEs, laboratory shifts, vital signs changes' },
      { id: '10.6', title: '10.6 Handling of Missing Data and Intercurrent Events', promptHint: 'Multiple imputation (MI), pattern-mixture models, tipping point sensitivity analysis, treatment policy strategy' },
      { id: '10.7', title: '10.7 Interim Analyses and Multiplicity', promptHint: 'Planned interim look for efficacy or futility (O’Brien-Fleming boundary), gatekeeping / Hochberg hierarchy for secondary endpoints' }
    ]
  },
  {
    id: 'section-11',
    stepNumber: 11,
    title: '11. Trial Oversight and General Considerations',
    description: 'ICH GCP compliance, IRB/IEC approval, Data Monitoring Committee (DMC), GDPR data confidentiality, and auditing.',
    subsections: [
      { id: '11.1', title: '11.1 Regulatory and Ethical Compliance', promptHint: 'Declaration of Helsinki, ICH GCP (E6 R2/R3), local regulations (FDA 21 CFR 312, EU CTR 536/2014)' },
      { id: '11.2', title: '11.2 Informed Consent', promptHint: 'Consent process, re-consent upon protocol amendments, assent for minors' },
      { id: '11.3', title: '11.3 Committees (DMC, Steering, Adjudication)', promptHint: 'Independent Data Monitoring Committee (IDMC), Steering Committee, Blinded Clinical Events Committee (CEC)' },
      { id: '11.4', title: '11.4 Data Protection and Confidentiality', promptHint: 'Pseudonymization, subject identification codes, GDPR and HIPAA compliance' },
      { id: '11.5', title: '11.5 Data Handling, Source Documents, Record Retention', promptHint: 'Electronic Data Capture (EDC), eCRF completion, 25-year minimum archive retention' },
      { id: '11.6', title: '11.6 Quality Management and Monitoring', promptHint: 'Risk-based monitoring (RBM), site initiation visits, regular monitoring frequency, audit rights' },
      { id: '11.7', title: '11.7 Protocol Deviations', promptHint: 'Identification, documentation, categorization (major vs minor), reporting to IRB/IEC' },
      { id: '11.8', title: '11.8 Early Termination or Site Closure', promptHint: 'Sponsor termination criteria, safety triggers, orderly transition of trial subjects' },
      { id: '11.9', title: '11.9 Insurance and Indemnity', promptHint: 'Clinical trial liability insurance, subject compensation for trial-related injury' },
      { id: '11.10', title: '11.10 Publication and Data Sharing Policy', promptHint: 'Authorship criteria (ICMJE), public registry results posting (ClinicalTrials.gov), open science data sharing' }
    ]
  },
  {
    id: 'section-12',
    stepNumber: 12,
    title: 'Appendices',
    description: 'Abbreviations, literature references, country-specific requirements, laboratory panels, contraception rules, and amendments.',
    subsections: [
      { id: '12.1', title: 'Appendix 1: Glossary and Abbreviations', promptHint: 'Comprehensive alphabetical list of acronyms and medical definitions used across the protocol' },
      { id: '12.2', title: 'Appendix 2: References', promptHint: 'Numbered list of key medical literature, clinical guidelines, and previous trial publications' },
      { id: '12.3', title: 'Appendix 3: Country-Specific Requirements', promptHint: 'Specific regional appendices (FDA US IND, EMA EU CTR, PMDA Japan)' },
      { id: '12.4', title: 'Appendix 4: Clinical Laboratory Tests List', promptHint: 'Detailed laboratory test table (Hematology, Biochemistry, Coagulation, Urinalysis, Serology, Special Biomarkers)' },
      { id: '12.5', title: 'Appendix 5: Contraception Guidance', promptHint: 'Highly effective methods of contraception (<1% failure rate), pregnancy testing schedules, barrier methods' },
      { id: '12.6', title: 'Appendix 6: Amendment Summary', promptHint: 'Protocol history log: Version, date, section amended, rationale for change' }
    ]
  },
  {
    id: 'section-13',
    stepNumber: 13,
    title: 'Extra SPIRIT Items',
    description: 'SPIRIT 2013 mandatory checklist items including public registry, patient involvement, dissemination, and post-trial care.',
    subsections: [
      { id: '13.1', title: 'Trial Registration and Funding', promptHint: 'Primary registry (ClinicalTrials.gov / WHO ICTRP), grant numbers, sponsor funding disclosure' },
      { id: '13.2', title: 'Patient and Public Involvement (PPI)', promptHint: 'Patient advisory groups, protocol design input, burden assessment on trial participants' },
      { id: '13.3', title: 'Dissemination Plans', promptHint: 'Plain-language summary for participants, scientific publication timeline, medical conferences' },
      { id: '13.4', title: 'Ancillary and Post-Trial Care', promptHint: 'Arrangements for post-trial access to intervention, compensation for trial injury' }
    ]
  }
];

module.exports = {
  PROTOCOL_SECTIONS
};

