# ProtocolGen AI — Clinical Trial Protocol Generator Chatbot
### Compliant with ICH M11 (CeSHarP), ICH GCP (E6 R2/R3), and the SPIRIT 2013 Statement

A specialized AI medical writing assistant and clinical trial protocol generator built with **React (Vite + Tailwind CSS)** for the frontend and **Hugging Face Free LLMs** (with intelligent clinical domain synthesis) as the engine.

---

## 🌟 Key Features

1. **Protocol Title Search & Live Web References**:
   - Enter any clinical trial title (e.g. *A Phase 3 Study of Tirzepatide in Heart Failure with Preserved Ejection Fraction and Obesity*).
   - Real-time querying of official biomedical registries:
     - **ClinicalTrials.gov REST API v2** (NCT identifiers, phases, primary/secondary outcomes, eligibility criteria, study design).
     - **Europe PMC / PubMed NCBI E-Utilities** (Peer-reviewed medical publications, DOIs, abstracts, and trial citations).
   - Interactive reference cards with source links and one-click inclusion into protocol prompts.

2. **Full ICH M11 & SPIRIT Protocol Architecture (13 Guided Steps)**:
   - **Step 1: Protocol Summary** (1.1 Synopsis, 1.2 Trial schema flowchart diagram, 1.3 Schedule of activities [SoA] visit table)
   - **Step 2: Introduction** (2.1 Purpose of trial and background, 2.2 Benefit-risk assessment)
   - **Step 3: Objectives, Endpoints and Estimands** (3.1 Primary objective/endpoint/ICH E9 R1 estimand, 3.2 Secondary endpoints, 3.3 Exploratory objectives)
   - **Step 4: Trial Design** (4.1 Overall design, 4.2 Rationale for comparator/dose, 4.3 Post-trial access, 4.4 Definitions)
   - **Step 5: Trial Population** (5.1 Selection rationale, 5.2 Inclusion criteria, 5.3 Exclusion criteria, 5.4 Lifestyle restrictions, 5.5 Screen failures)
   - **Step 6: Trial Intervention and Concomitant Therapy** (6.1 Intervention description, 6.2 Dosing/titration, 6.3 Storage/accountability, 6.4 Randomization/blinding, 6.5 Compliance, 6.6 Dose mods, 6.7 Overdose, 6.8 Concomitant & rescue)
   - **Step 7: Discontinuation and Withdrawal** (7.1 Intervention discontinuation vs study withdrawal, 7.2 Consent withdrawal, 7.3 Lost to follow-up)
   - **Step 8: Trial Assessments and Procedures** (8.1 Screening/baseline, 8.2 Efficacy assessments, 8.3 Safety vitals/ECG/labs, 8.4 PK, 8.5 PD & biomarkers, 8.6 Immunogenicity & genetics, 8.7 Medical resource utilization)
   - **Step 9: Safety Reporting** (9.1 Definitions AE/SAE/AESI, 9.2 Collection timing, 9.3 Severity/causality, 9.4 SUSAR reporting timelines, 9.5 Pregnancy reporting, 9.6 Product complaints)
   - **Step 10: Statistical Considerations** (10.1 Hypotheses, 10.2 Sample size determination, 10.3 Analysis sets ITT/PP/Safety, 10.4 MMRM analyses, 10.5 Safety analyses, 10.6 Missing data/estimand sensitivity, 10.7 Interim & multiplicity)
   - **Step 11: Trial Oversight and General Considerations** (11.1 GCP & Helsinki compliance, 11.2 Informed consent, 11.3 DMC/CEC committees, 11.4 GDPR/HIPAA privacy, 11.5 Data handling & 25-yr records, 11.6 Quality monitoring, 11.7 Deviations, 11.8 Early termination, 11.9 Insurance, 11.10 Publication)
   - **Step 12: Appendices** (Glossary & abbreviations, References, Country-specific requirements, Clinical lab tests panel, Contraception guidance, Amendment history)
   - **Step 13: Extra SPIRIT Items** (Trial registration & funding, Patient & public involvement [PPI], Dissemination plans, Ancillary & post-trial care)

3. **Hugging Face Free LLM Engine & Zero-Configuration Fallback**:
   - Integrated with Hugging Face Serverless Inference:
     - `huihui-ai/Qwen2.5-72B-Instruct-abliterated` (Meta - Recommended)
     - `Qwen/Qwen2.5-72B-Instruct` (Alibaba)
     - `mistralai/Mistral-7B-Instruct-v0.3` (Mistral AI)
     - `google/gemma-2-9b-it` (Google)
     - `microsoft/Phi-3-mini-4k-instruct` (Microsoft)
   - Add your free Hugging Face User Access Token (`hf.co/settings/tokens`) via the Settings button.
   - Built-in **Clinical Domain Synthesis Engine**: automatically acts as a zero-downtime fallback if no token is configured or if HF servers are rate-limited, ensuring 100% immediate usability.

4. **Interactive Co-Pilot & Chatbot**:
   - Tailored step suggestions: Offers custom prompt ideas for each section (e.g. sample size assumptions, dosing escalations, visit frequencies).
   - "Insert into Section": Apply conversational AI suggestions straight into the active document draft.
   - Live Markdown editing: Switch between formatted preview and raw text editor.

5. **Multi-Format Export**:
   - **Microsoft Word (.docx)**: Formal title page, table of contents, headings, formatted tables, and bulleted criteria.
   - **Markdown (.md)**: Full GitHub Flavored Markdown document.
   - **Print / PDF**: Clean print stylesheets for document generation.
   - **JSON**: Structured protocol dataset for downstream systems.

---

## 🚀 Quick Start

### 1. Start the Application
Run both backend and frontend concurrently:
\`\`\`bash
npm run dev
\`\`\`
Or launch the production server:
\`\`\`bash
npm start
\`\`\`
- Open your browser at **\`http://localhost:5000\`** (or \`http://localhost:5173\` in Vite dev mode).

### 2. Optional: Hugging Face Token Setup
1. Click the **Settings (gear / spark)** button in the top navigation bar.
2. Enter your free Hugging Face Access Token from [hf.co/settings/tokens](https://huggingface.co/settings/tokens).
3. Select your preferred model (e.g., *Llama 3.1 8B Instruct*).
4. Click **Save & Apply**.
*(Note: If left empty, the application seamlessly runs on the built-in clinical synthesis engine).*

---

## 📁 Project Architecture

\`\`\`
protocol_gen/
├── client/                     # React Frontend (Vite + Tailwind CSS + Lucide)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header, progress bar, export buttons, model settings
│   │   │   ├── TitleInputBar.jsx   # Protocol title input, presets, web search trigger
│   │   │   ├── Stepper.jsx         # 13-step ICH M11 & SPIRIT navigation stepper
│   │   │   ├── ReferencesDrawer.jsx# Real ClinicalTrials.gov & Europe PMC reference cards
│   │   │   ├── ChatPanel.jsx       # Interactive chatbot, step guidance, quick prompts
│   │   │   ├── DocumentViewer.jsx  # Split view preview, live markdown editor, SoA tables
│   │   │   └── SettingsModal.jsx   # Hugging Face token & model configuration
│   │   ├── App.jsx                 # Main application state and coordinator
│   │   ├── index.css               # Clinical typography, tables, and print styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Express API Backend
│   ├── services/
│   │   ├── referenceService.js     # Live search on ClinicalTrials.gov v2 & Europe PMC
│   │   ├── protocolStructure.js    # ICH M11 harmonized sections & SPIRIT checklists
│   │   ├── hfService.js            # Hugging Face inference + Clinical synthesis engine
│   │   └── docxExportService.js    # Formatted Microsoft Word (.docx) generation
│   └── index.js                    # Express REST endpoints
└── package.json
\`\`\`

