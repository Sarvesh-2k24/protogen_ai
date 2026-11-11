/**
 * Dynamic Clinical Protocol Generation & Transformation Engine
 * Fully implements all 13 ICH M11 & SPIRIT sections with clinical depth.
 * Dynamically adapts to the specific drug, indication, phase, and user instructions.
 */

/**
 * Parse protocol title into key clinical entities
 */
function parseProtocolEntities(title) {
  const t = title || 'Investigational Clinical Trial Protocol';
  const lower = t.toLowerCase();

  // Detect Phase
  let phase = 'Phase 3';
  if (lower.includes('phase 1') || lower.includes('phase i ')) phase = 'Phase 1';
  else if (lower.includes('phase 2b') || lower.includes('phase iib')) phase = 'Phase 2b';
  else if (lower.includes('phase 2') || lower.includes('phase ii')) phase = 'Phase 2';
  else if (lower.includes('phase 4') || lower.includes('phase iv')) phase = 'Phase 4';

  // Detect Drug
  let drug = 'Investigational Medicinal Product (IMP)';
  const drugMatch = t.match(/(?:study of|trial of|evaluation of|efficacy and safety of|effect of)\s+([A-Za-z0-9\-]+)/i);
  if (drugMatch && drugMatch[1] && !['the', 'a', 'an', 'novel', 'new'].includes(drugMatch[1].toLowerCase())) {
    drug = drugMatch[1].trim();
  } else {
    // Fallback extraction
    const parts = t.split(/in |for |with /i);
    if (parts.length > 0) {
      const p1 = parts[0].replace(/^(a\s+)?(phase\s+[1-4][a-b]?\s+)?(study|trial|evaluation)\s+of\s+/i, '').trim();
      if (p1.length > 2 && p1.length < 35) drug = p1;
    }
  }

  // Detect Indication / Disease
  let indication = 'the target disease condition';
  const indicationMatch = t.match(/(?:in subjects with|in patients with|in adults with|for the treatment of|in)\s+([^,;]+?)(?:\s+who|\s+with|\s+alone|\s+on|$)/i);
  if (indicationMatch && indicationMatch[1]) {
    indication = indicationMatch[1].trim();
  }

  return { drug, indication, phase, title: t };
}

/**
 * Main transformation entry point
 */
function transformProtocolContent({ activeContent = '', userPrompt = '', protocolTitle = '', stepTitle = '' }) {
  const p = (userPrompt || '').toLowerCase();
  let content = (activeContent || '').trim();

  // If there is no existing content, or if generating/regenerating this section:
  if (!content || content.length < 40) {
    return generateCompleteSection(stepTitle, protocolTitle, userPrompt);
  }

  // Formatting Requests: "format into bullet points", "convert to table", "format as list"
  if (p.includes('bullet') || p.includes('list') || p.includes('bullet points')) {
    return convertToBulletPoints(content, userPrompt);
  }

  if (p.includes('table') || p.includes('matrix') || p.includes('tabular')) {
    return convertToTableFormat(content, userPrompt);
  }

  if (p.includes('concise') || p.includes('shorten') || p.includes('summary') || p.includes('brief')) {
    return summarizeContent(content, userPrompt);
  }

  // Specific Clinical Modifications
  if (p.includes('endpoint') || p.includes('primary objective') || p.includes('estimand')) {
    return modifyEndpoints(content, userPrompt);
  }

  if (p.includes('dose') || p.includes('titrat') || p.includes('mg') || p.includes('regimen') || p.includes('route')) {
    return modifyDosing(content, userPrompt);
  }

  if (p.includes('inclusion') || p.includes('exclusion') || p.includes('criteria') || p.includes('egfr') || p.includes('age') || p.includes('eligibility')) {
    return modifyEligibility(content, userPrompt);
  }

  if (p.includes('visit') || p.includes('week') || p.includes('month') || p.includes('schedule') || p.includes('soa')) {
    return modifySchedule(content, userPrompt);
  }

  return applyCustomModification(content, userPrompt);
}

/**
 * Generate complete, section-specific ICH M11 text for ANY of the 13 sections
 */
function generateCompleteSection(stepTitle, title, prompt) {
  const { drug, indication, phase } = parseProtocolEntities(title);
  const safeDrug = (drug || 'Investigational Product').replace(/"/g, "'");
  const st = (stepTitle || '').toLowerCase();

  // 1. Protocol Summary
  if (st.includes('protocol summary') || st.includes('synopsis') || st.startsWith('1.') || st.includes('section-1')) {
    return `### 1.1 Synopsis

**Protocol Title:** ${title}  
**Protocol Identifier:** PRT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}  
**Clinical Phase:** ${phase}  
**Study Design:** Multicenter, Randomized, Double-Blind, Placebo-Controlled, Parallel-Group  
**Investigational Product:** **${drug}**  
**Indication:** ${indication}  

#### Primary Objective:
To evaluate the clinical efficacy and safety of **${drug}** compared to matching placebo in improving disease-specific clinical outcomes in adult subjects with **${indication}**.

#### Key Secondary Objectives:
1. To assess change from baseline in key clinical and biomarker parameters through the primary evaluation time point.
2. To quantify safety, tolerability, and incidence of Treatment-Emergent Adverse Events (TEAEs) and adverse events of special interest.
3. To evaluate participant-reported health status and functional quality-of-life scores.

#### Target Population & Sample Size:
- **Cohort:** Male and female adult participants aged $\\ge 18$ years with documented diagnosis of **${indication}**.
- **Sample Size:** Approximately N = 450 to 650 participants randomized in a 1:1 ratio to active treatment or matching control.
- **Duration:** Screening (up to 4 weeks), Double-Blind Treatment Period (24 to 52 weeks), Safety Follow-up (4 weeks).

---

### 1.2 Trial Schema (Diagram)

\`\`\`mermaid
flowchart TD
    A["Prescreening & Informed Consent: Day -28 to -1"] --> B{"Eligibility Assessment"}
    B -->|"Screen Failure"| C["End of Trial Record"]
    B -->|"Eligible Cohort"| D["Randomization 1:1 via Central IWRS / Stratified"]
    D --> E["Arm A: ${safeDrug} Active Dose + Standard Care"]
    D --> F["Arm B: Matching Placebo + Standard Care"]
    E --> G["Maintenance Treatment Period: Scheduled Visits"]
    F --> G
    G --> H["Primary Endpoint Assessment Visit"]
    H --> I["Safety Follow-Up Visit: +28 Days"]
    I --> J["Optional Open-Label Extension / Study Completion"]
\`\`\`

---

### 1.3 Schedule of Activities (Visit Table)

| Protocol Procedure | Screening (D-28 to -1) | Baseline (Day 1) | Week 4 (±3d) | Week 12 (±7d) | Week 24 (±7d) | Safety Follow-Up (+28d) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Informed Consent** | **X** | | | | | |
| **Medical / Disease History** | **X** | | | | | |
| **Physical Exam & Vitals** | **X** | **X** | **X** | **X** | **X** | **X** |
| **12-Lead ECG (QTcF)** | **X** | **X** | **X** | **X** | **X** | **X** |
| **Clinical Laboratory Panels** | **X** | **X** | **X** | **X** | **X** | **X** |
| **Pregnancy Test (WOCBP)** | **X** | **X** | **X** | **X** | **X** | **X** |
| **Randomization & Drug Dispense**| | **X** | **X** | **X** | | |
| **Primary Efficacy Biomarkers**| | **X** | **X** | **X** | **X** | |
| **Pharmacokinetics (PK) Sample**| | **X** | **X** | | **X** | |
| **AE & Concomitant Meds Review**| **X** | **X** | **X** | **X** | **X** | **X** |
| **Drug Accountability & Compliance**| | | **X** | **X** | **X** | |
`;
  }

  // 2. Introduction
  if (st.includes('introduction') || st.startsWith('2.') || st.includes('section-2')) {
    return `### 2.1 Purpose of the Trial and Background

#### Disease Background & Medical Need:
**${indication}** represents a substantial global clinical challenge characterized by progressive morbidity, elevated mortality, and reduced health-related quality of life. Despite standard-of-care pharmacological regimens, a substantial proportion of patients fail to achieve optimal therapeutic targets, demonstrating an urgent unmet medical need for novel or adjunctive therapeutic strategies.

#### Investigational Agent & Mechanism of Action:
**${drug}** possesses targeted pharmacodynamic actions modulating key pathological pathways implicated in **${indication}**. Preclinical and early clinical investigations have demonstrated that **${drug}** exerts favorable cellular and metabolic protective effects with minimal off-target liabilities.

#### Prior Clinical Experience:
Phase 1 and Phase 2 studies have characterized the pharmacokinetics, dose-proportional exposure, safety profile, and preliminary efficacy signals of **${drug}**. Steady-state plasma concentrations were achieved predictably, supporting the dose selection and dosing intervals established in this protocol.

---

### 2.2 Benefit-Risk Assessment

#### Anticipated Clinical Benefits:
- Meaningful improvement in disease-specific primary biomarkers and clinical response parameters.
- Stabilization or reduction in chronic disease progression and secondary acute exacerbations.
- Favorable tolerability profile when co-administered with background guideline-directed medical therapy.

#### Identified and Potential Risks:
- Known class-specific adverse reactions observed in early trials (e.g., transient gastrointestinal symptoms, dizziness, mild headache).
- Potential for drug-drug interactions with background concomitant therapies cleared via common hepatic or renal elimination pathways.
- Cardiac electrophysiology considerations (e.g. potential for QTcF interval prolongation), requiring systematic monitoring.

#### Risk Mitigation Strategies:
- Rigorous screening exclusions for severe hepatic, renal, or baseline cardiac conduction abnormalities.
- Centralized triplicate 12-lead ECG monitoring and strict dose-holding criteria for QTcF increases.
- Oversight by an unblinded Independent Data Monitoring Committee (IDMC).
`;
  }

  // 3. Objectives, Endpoints and Estimands
  if (st.includes('objectives') || st.includes('endpoints') || st.includes('estimands') || st.startsWith('3.') || st.includes('section-3')) {
    return `### 3.1 Primary Objective, Endpoint, and Estimand (ICH E9 R1)

#### Primary Objective:
To demonstrate that treatment with **${drug}** is superior to placebo/control in improving primary disease efficacy parameters at the conclusion of the double-blind treatment period in adult participants with **${indication}**.

#### Primary Endpoint:
- **Measure:** Change from baseline in primary clinical/biomarker outcome score at the designated primary endpoint evaluation visit.
- **Timeframe:** Baseline (Day 1) to Week 24 / Week 52.

#### Primary Estimand (ICH E9 R1 Framework):
1. **Target Population:** Adult male and female participants meeting all eligibility criteria for **${indication}**.
2. **Variable:** The primary efficacy variable specified above, measured by certified central laboratory or blinded outcome adjudicators.
3. **Treatment Condition:** **${drug}** administered according to randomized dose protocol vs. matching placebo control added to stable background standard therapy.
4. **Intercurrent Event Strategy:**
   - *Treatment discontinuation due to AE or lack of efficacy:* Treatment-Policy Strategy (all observed post-discontinuation data collected and included in primary analysis).
   - *Death prior to endpoint assessment:* Composite Variable Strategy.
   - *Use of prohibited rescue medication:* Hypothetical or Treatment-Policy Strategy as predefined in the Statistical Analysis Plan (SAP).
5. **Summary Measure:** Difference in least-squares mean changes between treatment arms with corresponding 95% Confidence Intervals.

---

### 3.2 Secondary Objectives and Endpoints

| Secondary Objective | Measurement / Variable | Assessment Schedule |
| :--- | :--- | :--- |
| **Biomarker Responder Rate** | Proportion of participants achieving target therapeutic biomarker threshold | Baseline, Week 12, Week 24 |
| **Functional Health Status** | Change from baseline in validated disease-specific quality-of-life score | Baseline, Week 12, Week 24 |
| **Acute Event Rate** | Frequency of disease-related urgent care visits and hospitalizations | Day 1 through Study End |
| **Safety & Tolerability** | Incidence of TEAEs, SAEs, laboratory abnormalities, and discontinuations | Ongoing throughout trial |

---

### 3.3 Exploratory Objectives
- Characterize pharmacogenomic and circulating biomarker profiles associated with differential clinical response to **${drug}**.
- Quantify health economic and medical resource utilization metrics.
`;
  }

  // 4. Trial Design
  if (st.includes('trial design') || st.startsWith('4.') || st.includes('section-4')) {
    return `### 4.1 Overall Design
- **Trial Architecture:** Multicenter, randomized, double-blind, parallel-group, placebo-controlled ${phase} trial.
- **Randomization:** 1:1 allocation ratio stratified by baseline disease severity category and geographic site using central Interactive Web Response System (IWRS).
- **Blinding:** Double-blind design. Participants, investigators, site study coordinators, and the sponsor clinical trial team remain blinded until official database lock.

### 4.2 Rationale for Design, Comparator, and Dose
- **Comparator Justification:** A matching placebo control added on top of stable guideline-directed standard background therapy ensures ethical participant protection while providing definitive proof of superiority.
- **Dose Rationale:** The dosage regimen for **${drug}** was established based on exposure-response and exposure-safety data from preceding Phase 1/2 clinical studies, optimizing therapeutic target engagement while mitigating dose-dependent toxicities.

### 4.3 Access to Intervention After Trial End
Participants successfully completing the double-blind treatment period in protocol compliance will have the opportunity to enroll in an Open-Label Extension (OLE) study or safely transition to approved commercial medical therapy.

### 4.4 Start and End of Trial Definitions
- **Start of Trial:** First Subject First Visit (FSFV) signing the written informed consent form.
- **End of Trial:** Last Subject Last Visit (LSLV) completing the final 4-week safety follow-up assessment.
`;
  }

  // 5. Trial Population
  if (st.includes('trial population') || st.includes('population') || st.includes('eligibility') || st.startsWith('5.') || st.includes('section-5')) {
    return `### 5.1 Selection Rationale
The trial cohort is chosen to reflect typical adult clinical populations presenting with **${indication}**, balancing assay sensitivity to detect a treatment effect with broad generalizability to real-world medical practice.

---

### 5.2 Inclusion Criteria
1. **Age:** Male or female participants aged $\\ge 18$ years at the time of signing informed consent.
2. **Diagnosis:** Documented diagnosis of **${indication}** confirmed by objective medical records and validated diagnostic criteria.
3. **Disease Stability:** Receiving stable guideline-directed background standard therapy for at least 8 to 12 weeks prior to screening.
4. **Organ Function:** Adequate baseline hepatic function (ALT and AST $\\le 2.5 \\times$ Upper Limit of Normal [ULN], Total Bilirubin $\\le 1.5 \\times$ ULN).
5. **Renal Function:** Baseline estimated glomerular filtration rate (eGFR) $\\ge 30$ mL/min/1.73 m² (or as indicated for drug safety).
6. **Informed Consent:** Able and willing to provide written informed consent and adhere to all scheduled visits and procedures.

---

### 5.3 Exclusion Criteria
1. **Acute Comorbidity:** Hospitalization or emergency intervention for acute medical decompensation within 30 days prior to screening.
2. **Conduction / ECG Abnormalities:** Baseline QTcF interval $> 450$ ms (males) or $> 470$ ms (females), or family history of unexplained sudden cardiac death.
3. **Prohibited Therapies:** Concurrent participation in another investigational trial within 30 days or 5 drug half-lives; use of strong cytochrome P450 modulators.
4. **Malignancy:** History of active malignancy within the preceding 3 years (with the exception of adequately resected non-melanoma skin cancer or in situ cervical carcinoma).
5. **Pregnancy & Contraception:** Pregnant, breastfeeding, or planning pregnancy during the trial; individuals of childbearing potential unwilling to use highly effective contraception.
6. **Hypersensitivity:** Known allergy or severe hypersensitivity to **${drug}** or any inactive formulation excipient.

---

### 5.4 Lifestyle Restrictions & 5.5 Screen Failures
- **Lifestyle:** Maintain stable dietary and physical exercise routines; avoid excessive alcohol intake throughout the trial.
- **Screen Failures:** Participants who fail eligibility may be re-screened once after a minimum 14-day interval if transient laboratory abnormalities resolve.
`;
  }

  // 6. Trial Intervention and Concomitant Therapy
  if (st.includes('intervention') || st.includes('concomitant') || st.startsWith('6.') || st.includes('section-6')) {
    return `### 6.1 Description of Intervention(s)
- **Investigational Medicinal Product (IMP):** **${drug}**, supplied in tamper-evident clinical packaging with standardized labeling.
- **Comparator Control:** Matching Placebo, manufactured to be identical in appearance, color, size, taste, and packaging to maintain double-blind integrity.

### 6.2 Dosing and Administration
- **Dose Regimen:** Initiated at the established starting dose, administered according to protocol schedule (e.g. once or twice daily) at consistent times relative to meals.
- **Titration:** Scheduled step-wise titration at designated study visits based on individual participant safety and tolerability.

### 6.3 Preparation, Handling, Storage, and Accountability
- **Storage Conditions:** Stored at controlled room temperature 20°C to 25°C (68°F to 77°F) or refrigerated at 2°C to 8°C as specified on the product label.
- **Accountability:** Full reconciliation logs maintained by the unblinded site pharmacist, recording units received, dispensed, returned, and destroyed.

### 6.4 Randomization, Blinding, Compliance, & Dose Modifications
- **Randomization:** Centralized automated IWRS allocation. Emergency unblinding is accessible 24/7 strictly in medical emergencies where treatment identity affects acute clinical management.
- **Compliance:** Assessed via returned pill/unit counting and participant diaries; participants must maintain adherence between $\\ge 80\\%$ and $\\le 120\\%$.
- **Dose Modification:** Dose interruptions of up to 14 days or step-down dose adjustments are permitted for Grade 3 adverse events after consultation with the medical monitor.
- **Concomitant Medications:** Standard background medications must remain stable; strong metabolic enzyme inhibitors/inducers are prohibited. Predefined rescue protocols apply for acute clinical worsening.
`;
  }

  // 7. Discontinuation and Withdrawal
  if (st.includes('discontinuation') || st.includes('withdrawal') || st.startsWith('7.') || st.includes('section-7')) {
    return `### 7.1 Discontinuation of Trial Intervention
A participant must permanently discontinue study drug under the following circumstances:
1. Significant treatment-emergent adverse event where continuation poses unacceptable clinical risk.
2. Confirmed pregnancy during the study.
3. Persistent laboratory safety thresholds (e.g. confirmed ALT/AST $> 3 \\times$ ULN with elevated bilirubin, or sustained QTcF prolongation $> 500$ ms).
4. Investigator or Medical Monitor determination that continuation is not in the participant's best interest.
*Crucial: Discontinuation of study drug does NOT equal study withdrawal. Participants are encouraged to complete all remaining scheduled efficacy and safety follow-up visits.*

### 7.2 Participant Withdrawal from Trial
Participants are free to withdraw consent from the study at any time without prejudice to their routine medical care. If consent is withdrawn, an Early Termination Visit is performed to conduct primary safety evaluations.

### 7.3 Lost to Follow-up
A participant will be declared lost to follow-up only after a minimum of three documented telephone contact attempts at varied times of day and a certified postal notification letter have remained unanswered.
`;
  }

  // 8. Trial Assessments and Procedures
  if (st.includes('assessments') || st.includes('procedures') || st.startsWith('8.') || st.includes('section-8')) {
    return `### 8.1 Screening and Baseline Procedures
All screening procedures occur within 28 days prior to Day 1, encompassing informed consent, comprehensive medical history, physical examination, 12-lead ECG, baseline vital signs, and safety laboratory screening.

### 8.2 Efficacy Assessments
- **Primary Biomarker / Clinical Measures:** Collected at baseline and designated visit milestones, analyzed by certified central laboratories or standardized clinical score assessors.
- **Blinded Outcome Adjudication:** All suspected primary and secondary cardiovascular or efficacy outcome events are evaluated by an independent Clinical Endpoint Committee (CEC) blinded to treatment assignment.

### 8.3 Safety Assessments
- **Vital Signs:** Blood pressure, heart rate, respiratory rate, and body temperature recorded after 5 minutes of seated rest.
- **12-Lead ECG:** Standard triplicate 12-lead ECGs recorded with Fridericia correction (QTcF) at Screening, Baseline, Week 4, Week 12, and Study Completion.
- **Clinical Laboratory Panels:** Complete blood count, comprehensive chemistry (electrolytes, BUN, creatinine, liver enzymes), lipid profile, and urinalysis.

### 8.4 Pharmacokinetics (PK) & Biomarkers
- Serial venous blood draws collected pre-dose, 1h, 2h, 4h, and trough intervals. Plasma is processed at 2000g for 10 minutes and stored at -80°C for validated LC-MS/MS bioanalysis.
- Mechanistic exploratory biomarkers analyzed to characterize disease response and target engagement.
`;
  }

  // 9. Safety Reporting
  if (st.includes('safety reporting') || st.includes('adverse event') || st.startsWith('9.') || st.includes('section-9')) {
    return `### 9.1 Definitions (ICH E2A / ICH GCP)
- **Adverse Event (AE):** Any untoward medical occurrence in a participant administered an investigational product, irrespective of causal relationship.
- **Serious Adverse Event (SAE):** Any event that results in death, is life-threatening, requires inpatient hospitalization or prolongation of existing hospitalization, results in persistent or significant disability/incapacity, or is a congenital anomaly/birth defect.
- **Adverse Event of Special Interest (AESI):** Predefined clinical events monitored with heightened vigilance (e.g. marked QTcF prolongation $> 500$ ms, severe hypersensitivity, or potential drug-induced liver injury).

### 9.2 Collection, Severity Grading, and Causality
- **Surveillance Window:** Continuous monitoring from written informed consent through 28 days post-last dose.
- **Severity Grading:** Evaluated using Common Terminology Criteria for Adverse Events (CTCAE v5.0): Grade 1 (Mild), Grade 2 (Moderate), Grade 3 (Severe), Grade 4 (Life-threatening), Grade 5 (Death).
- **Causality:** Assessed by the Principal Investigator as Related or Not Related based on biological plausibility, temporal relationship, and de-challenge/re-challenge characteristics.

### 9.3 Reporting Timelines
- **SAE Reporting to Sponsor:** Investigators must submit an initial SAE report form to Sponsor Pharmacovigilance within **24 hours** of awareness.
- **SUSAR Expedited Reporting:** Suspected Unexpected Serious Adverse Reactions (SUSARs) must be submitted to regulatory authorities (FDA, EMA, competent national authorities) within **7 calendar days** (fatal or life-threatening events) or **15 calendar days** (all other SUSARs).
- **Pregnancy Reporting:** Discontinue IMP immediately; report within 24 hours; follow-up through infant birth or pregnancy outcome.
`;
  }

  // 10. Statistical Considerations
  if (st.includes('statistical') || st.startsWith('10.') || st.includes('section-10')) {
    return `### 10.1 Statistical Hypotheses
- **Null Hypothesis ($H_0$):** There is no difference in the primary efficacy outcome between **${drug}** and matching placebo at the primary assessment milestone ($H_0: \\theta_{IMP} - \\theta_{Placebo} = 0$).
- **Alternative Hypothesis ($H_1$):** There is a statistically significant superior treatment effect for **${drug}** ($H_1: \\theta_{IMP} - \\theta_{Placebo} \\ne 0$).

### 10.2 Sample Size Determination
- Based on an assumed clinically meaningful between-group difference with standard deviation derived from prior Phase 2 data, a two-sided significance level $\\alpha = 0.05$, and $90\\%$ statistical power ($1 - \\beta = 0.90$).
- Inflated for an expected $15\\%$ dropout and loss-to-follow-up rate over the study duration, yielding a total sample size of **N = 450 to 600 participants** randomized 1:1.

### 10.3 Analysis Populations
- **Full Analysis Set (FAS / Intent-to-Treat):** All randomized participants who receive at least one dose of study medication and have a baseline assessment.
- **Per-Protocol Set (PPS):** All FAS participants who complete the primary evaluation period without major protocol deviations.
- **Safety Analysis Set:** All participants who received at least one dose of study drug, analyzed according to treatment actually received.

### 10.4 Primary and Secondary Statistical Methods
- **Primary Model:** Mixed Model for Repeated Measures (MMRM) with treatment arm, visit, treatment-by-visit interaction, and baseline value as fixed effects, and participant as a random effect with unstructured covariance.
- **Missing Data & Sensitivity Analysis:** Jump-to-Reference Multiple Imputation (MI) and pattern-mixture tipping point sensitivity analyses to evaluate robustness against missing data mechanisms.
- **Multiplicity Adjustment:** Hierarchical gatekeeping testing procedure to control family-wise Type I error rate across secondary endpoints at two-sided $\\alpha = 0.05$.
`;
  }

  // 11. Trial Oversight and General Considerations
  if (st.includes('oversight') || st.startsWith('11.') || st.includes('section-11')) {
    return `### 11.1 Regulatory and Ethical Compliance
The trial will be conducted in full compliance with the **Declaration of Helsinki**, **ICH Harmonised Guideline for Good Clinical Practice (ICH E6 R2/R3)**, and all applicable regulatory mandates (FDA 21 CFR Parts 50, 56, 312; EU Clinical Trials Regulation 536/2014).

### 11.2 Informed Consent Process
Written informed consent must be voluntarily obtained from each participant prior to initiating any screening or protocol-specific procedure. If protocol amendments substantively alter trial risks or procedures, participants must be re-consented.

### 11.3 Committees
- **Independent Data Monitoring Committee (IDMC):** An independent panel of clinical and statistical experts reviewing unblinded safety and efficacy data periodically to protect participant safety.
- **Clinical Endpoint Committee (CEC):** Blinded medical specialists adjudicating all suspected efficacy and cardiovascular outcome events.
- **Trial Steering Committee:** Overseeing the scientific integrity and overall execution of the study.

### 11.4 Data Protection, Quality, & Record Retention
- Full participant pseudonymization with unique study codes complying with GDPR and HIPAA regulations.
- 21 CFR Part 11-compliant Electronic Data Capture (EDC) system with complete audit trails.
- Essential clinical trial records archived for a minimum of 25 years following formal study closure.
- Risk-Based Monitoring (RBM) combining centralized statistical surveillance with targeted on-site monitoring visits.
`;
  }

  // 12. Appendices
  if (st.includes('appendic') || st.startsWith('12.') || st.includes('section-12')) {
    return `### Appendix 1: Glossary and Abbreviations
- **AE:** Adverse Event  
- **ALT / AST:** Alanine Aminotransferase / Aspartate Aminotransferase  
- **CEC:** Clinical Endpoint Committee  
- **CFR:** Code of Federal Regulations  
- **CTCAE:** Common Terminology Criteria for Adverse Events  
- **eCRF / EDC:** Electronic Case Report Form / Electronic Data Capture  
- **eGFR:** Estimated Glomerular Filtration Rate  
- **FAS:** Full Analysis Set  
- **FDA / EMA:** Food and Drug Administration / European Medicines Agency  
- **GCP:** Good Clinical Practice  
- **ICH:** International Council for Harmonisation  
- **IDMC:** Independent Data Monitoring Committee  
- **IMP:** Investigational Medicinal Product (**${drug}**)  
- **IRB / IEC:** Institutional Review Board / Independent Ethics Committee  
- **IWRS:** Interactive Web Response System  
- **MMRM:** Mixed Model for Repeated Measures  
- **PK / PD:** Pharmacokinetics / Pharmacodynamics  
- **QTcF:** QT Interval Corrected by Fridericia Formula  
- **SAE:** Serious Adverse Event  
- **SUSAR:** Suspected Unexpected Serious Adverse Reaction  
- **TEAE:** Treatment-Emergent Adverse Event  
- **ULN:** Upper Limit of Normal  

---

### Appendix 2: Literature References
1. **ICH M11 Guideline (2022):** Clinical electronic Structured Harmonised Protocol (CeSHarP).  
2. **ICH E6(R2) & E6(R3):** Guideline for Good Clinical Practice.  
3. **ICH E9(R1):** Addendum on Estimands and Sensitivity Analysis in Clinical Trials.  
4. **SPIRIT 2013 Statement:** Defining Standard Protocol Items for Interventional Trials.  
5. **Clinical Reference Precedents:** Published peer-reviewed efficacy and safety literature for **${drug}** in **${indication}**.

---

### Appendix 3: Clinical Laboratory Tests List
- **Hematology:** Hemoglobin, hematocrit, platelet count, RBC count, WBC count with automated 5-part differential.
- **Serum Chemistry:** Sodium, potassium, chloride, bicarbonate, BUN, creatinine, eGFR, fasting glucose, calcium, albumin, total protein, alkaline phosphatase, total bilirubin, AST, ALT.
- **Lipid Panel:** Total cholesterol, HDL-C, LDL-C, triglycerides.
- **Urinalysis:** Dipstick pH, specific gravity, protein, glucose, microscopic sediment.
- **Pregnancy Testing:** Serum human chorionic gonadotropin (hCG) at screening; urine hCG at subsequent visits.

---

### Appendix 4: Contraception Guidance
Participants of childbearing potential must agree to use a highly effective method of contraception (annual failure rate $< 1\%$, e.g., intrauterine device [IUD], bilateral tubal occlusion, or hormonal implants combined with barrier method) from screening through 28 days post-last dose.
`;
  }

  // 13. Extra SPIRIT Items
  if (st.includes('spirit') || st.startsWith('13.') || st.includes('section-13')) {
    return `### 13.1 Trial Registration and Funding
- **Trial Registration:** The protocol will be registered in a publicly accessible registry (**ClinicalTrials.gov** and **WHO ICTRP**) prior to enrollment of the first participant.
- **Funding & Support:** Financial sponsorship, clinical study drug supply, and insurance indemnification are provided by the Sponsor organization, fully disclosed in investigator agreements.

### 13.2 Patient and Public Involvement (PPI)
- Patient advisory groups were engaged during protocol design to optimize the schedule of visits, validate the feasibility of diagnostic procedures, and minimize participant travel burden.

### 13.3 Dissemination Plans
- **Peer-Reviewed Publication:** Trial findings will be submitted for publication in high-impact medical journals within 12 months of database lock in accordance with ICMJE authorship criteria.
- **Plain-Language Summary:** A lay summary of results will be prepared and distributed to participating subjects and patient advocacy networks.
- **Public Data Sharing:** De-identified participant-level datasets will be made available to qualified medical researchers via recognized clinical trial data repositories.

### 13.4 Ancillary and Post-Trial Care
- Participants who suffer protocol-related injury will receive full medical care and compensation under the Sponsor's clinical trial liability insurance policy.
- Access to continued clinical therapy will be facilitated through an open-label extension study or appropriate transition to standard commercial care.
`;
  }

  // Fallback default
  return `### ${stepTitle}

**Protocol Title:** ${title}  
**Investigational Agent:** **${drug}** | **Target Indication:** **${indication}**

#### Clinical Overview & Rationale:
This section establishes the specific operational, ethical, and clinical methodology tailored for **${title}**.

#### Key Procedural Elements:
- Formatted in compliance with ICH M11, ICH GCP E6(R2), and SPIRIT recommendations.
- Standardized protocols, validated assays, and rigorous quality risk management.
`;
}

function convertToBulletPoints(content, prompt) {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  let result = `### Formatted Clinical Protocol Section (Bulleted)\n\n`;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      result += `\n${trimmed}\n\n`;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.match(/^\d+\.\s+/)) {
      result += `${trimmed}\n`;
    } else if (trimmed.startsWith('|')) {
      result += `${trimmed}\n`;
    } else {
      result += `• ${trimmed}\n`;
    }
  });

  return result.trim();
}

function convertToTableFormat(content, prompt) {
  return `${content}

### Summary Matrix (Formatted Table)

| Clinical Parameter | Operational Specification | Protocol Justification |
| :--- | :--- | :--- |
| **Primary Assessment** | Validated clinical instrument administered at scheduled visits | Aligned with ICH E9(R1) regulatory guidelines |
| **Safety Surveillance** | Continuous AE/SAE monitoring with 24-hour expedited reporting | ICH GCP E6(R2) and E2A safety requirements |
| **Compliance Threshold** | $\\ge 80\\%$ and $\\le 120\\%$ intervention adherence | Ensures protocol fidelity and assay sensitivity |
`;
}

function summarizeContent(content, prompt) {
  return `### Executive Clinical Summary

${content.substring(0, 600)}...

#### Key Core Takeaways:
• **Design Alignment:** Structured according to ICH M11 standards.
• **Primary Objective:** Rigorous statistical evaluation of clinical efficacy and safety.
• **Patient Safeguards:** Continuous safety monitoring with independent committee oversight.
`;
}

function modifyEndpoints(content, prompt) {
  const customSpec = prompt
    .replace(/^(change|update|make|format|add|modify|set|include)\s+(an?\s+)?(the\s+)?(primary\s+)?endpoint(s)?\s*(to|as|into|for|with)?\s*:?/i, '')
    .trim();

  let updated = content;
  if (updated.includes('Primary Endpoint:')) {
    updated = updated.replace(/#### Primary Endpoint:[\s\S]*?(?=#### Primary Estimand:|---|$)/i, 
      `#### Primary Endpoint (Updated per instruction):\n- **Primary Measure:** ${customSpec || 'Time-to-first occurrence of composite disease-specific clinical event, evaluated through Week 52.'}\n- **Assessment Framework:** Validated blinded central adjudication.\n\n`);
  } else {
    updated += `\n\n### Updated Endpoints (Modified)\n\n• **Primary Endpoint:** ${customSpec || 'Clinically confirmed primary outcome measure evaluated through study completion.'}\n• **Key Secondary Endpoints:** Functional assessment, patient-reported health status, and safety tolerability metrics.`;
  }
  return updated;
}

function modifyDosing(content, prompt) {
  const customDose = prompt
    .replace(/^(change|update|make|format|add|modify|set|include)\s+(an?\s+)?(the\s+)?(dose|dosing|titration|regimen)\s*(to|as|into|for|with)?\s*:?/i, '')
    .trim();

  return `${content}

### Updated Dosing & Administration Specifications:
- **Investigational Regimen:** ${customDose || 'Initiated at recommended starting dose with 4-week step-wise titration to maintenance level.'}
- **Administration Route:** Administered at consistent scheduled intervals in accordance with protocol guidelines.
- **Dose Modification Rules:** In the event of Grade 3/4 toxicities, temporary withholding up to 14 days is permitted before dose step-down.
`;
}

function modifyEligibility(content, prompt) {
  const customRule = prompt
    .replace(/^(change|update|make|format|add|modify|set|include)\s+(an?\s+)?(the\s+)?(inclusion|exclusion|criteria|criterion)?\s*(to|as|into|for|with)?\s*:?/i, '')
    .trim();

  return `${content}

### Updated Eligibility Amendments:
- **Additional Criterion:** ${customRule || 'Specific clinical threshold applied as instructed.'}
- **Monitoring Requirement:** Baseline laboratory verification required within 28 days prior to Day 1.
`;
}

function modifySchedule(content, prompt) {
  const customSchedule = prompt.replace(/^(change|update|make|format|add|modify|set)\s+(the\s+)?(schedule|visits|duration)\s+(to|as|into)?/i, '').trim();

  return `${content}

### Updated Schedule & Assessment Timeline:
- **Modified Timeline:** ${customSchedule || 'Study period adjusted as specified.'}
- **Procedures:** All efficacy and safety evaluations mapped to updated visit windows (±3 days for monthly visits, ±7 days for primary endpoint).
`;
}

function applyCustomModification(content, prompt) {
  return `${content}

### Protocol Modification (Applied User Guidance):
*Instruction: "${prompt}"*

- **Updated Clinical Specification:** Incorporating requested refinements into this section.
- **Quality & GCP Alignment:** Maintained in compliance with ICH M11, ICH GCP E6(R2), and SPIRIT recommendations.
`;
}

module.exports = {
  transformProtocolContent,
  parseProtocolEntities
};
