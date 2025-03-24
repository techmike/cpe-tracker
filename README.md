# 📊 Certification CPE Tracker (Google Sheets + Apps Script)

A smart and customizable **CPE/CEU Tracker** built in **Google Sheets** with automation powered by **Google Apps Script**. It supports various certification types including CISSP, CompTIA, ISACA, AWS, OSCP, and more.

👉 **[📁 Open the Certification CPE Tracker Template Sheet](https://docs.google.com/spreadsheets/d/1PTX8ch5CoxuutM8OF-GR6mGllPfaRldYDdzC4EkM3QI/edit?usp=sharing)**

---
## 📝 Overview

I created this tracker to help me manage my continuing education credits (CPEs/CEUs) across multiple certifications—some with renewal cycles, some with retakes, and others that are lifetime.

My goal was to build a **simple, scalable system** that:
- Tracks which CPEs apply to which certifications
- Monitors expiration cycles and yearly progress
- Flags events that still need action (like uploading proof)
- Can grow with me year after year

I hope this template helps others stay organized and confidently renew their certifications with ease.


## ✨ Key Features

### 🔁 Automated CPE Tracking
- Tracks **Cycle-based CPEs** (e.g., CISSP: 120 over 3 years)
- Tracks **Yearly CPEs** based on a rolling 365-day window
- Uses **CPE Categories** and applies per-cert limits (e.g., "Education", "Professional Development")

### 🧠 Smart Certification Logic
- Supports:
  - `CPE`: CPE-based renewals (e.g., CISSP, Security+)
  - `Retake`: No CPEs required; must retake exam (e.g., AWS Cloud Practitioner)
  - `Lifetime`: No expiration, no CPEs (e.g., OSCP, legacy A+)
  - `Planned`: Certifications not yet earned (future or blank Issued Date)

### 🔄 Auto-Calculated Fields
- `Cycle Required CPEs`, `Cycle Earned`, `Remaining`
- `Year Required`, `Year Earned`, `Remaining`
- `Queued Events`: CPEs that are upcoming or not yet completed
- `Proof Upload Status`: Flags CPEs with missing upload per cert

### 🧾 CPE Events Enhanced Logging
Each CPE event tracks:
- Event Name, Vendor, Link, Category
- Applicable Certs
- Status: `Completed`, `Not Completed`, or `Upcoming`
- Completion Date (actual)
- Certificate/Proof downloaded?
- **Proof uploaded to portal** (per cert)

---

## 🗂 Sheet Overview

### 📝 `Certifications`
| Column | Field |
|--------|-------|
| A | Certification Name |
| B | Issued Date |
| C | Expiration Date |
| D | Cycle Start |
| E | Cycle Length (years) |
| F | Cycle Required CPEs |
| G | Cycle Earned CPEs (auto) |
| H | Cycle Remaining CPEs (auto) |
| I | Current Year Start |
| J | Year Required CPEs (auto) |
| K | Year Earned CPEs (auto) |
| L | Year Remaining CPEs (auto) |
| M | Show Overage (Yes/No) |
| N | Queued Events (auto) |
| O | Proof Upload Flag (auto) |
| P | Renewal Type (`CPE`, `Retake`, `Lifetime`) |

![Certifications](./Certifications.png?raw=true "Certifications")

---

### 📅 `CPE_Events`
| Column | Field |
|--------|-------|
| A | Date Available |
| B | Event Name |
| C | CPEs Earned |
| D | Applicable Certs (comma-separated) |
| E | Category |
| F | Vendor Name |
| G | Actual Completion Date |
| H | Event Link |
| I | Proof Downloaded (Yes/No) |
| J | Completion Status (`Completed`, `Not Completed`, `Upcoming`) |
| K | Proof Uploaded to Portal (comma-separated certs) |

![Certifications](./CPE_Events.png?raw=true "CPE Events")

---

### 📌 `CPE_Categories`
| Column | Field |
|--------|-------|
| A | Certification |
| B | CPE Category |
| C | Allowed CPEs (`No Limit` or numeric) |

![Certifications](./CPE_Categories.png?raw=true "CPE Events")

---

## ⚙️ How Automation Works

### 🧩 Script Function: `updateCPETracker()`
- Loops through every certification
- Based on its type (`CPE`, `Retake`, `Lifetime`, `Planned`), it calculates:
  - Cycle CPE totals (respecting category caps)
  - Yearly rolling window CPE totals
  - Missing proof uploads per cert
  - Queued/incomplete events
- Writes results into the `Certifications` sheet

---

## 🔁 Automating Updates

### ✅ Set a Trigger (Time-Based)
1. Open **Extensions → Apps Script**
2. Go to the **Triggers tab** (⏱️)
3. Click **+ Add Trigger**
4. Set:
   - Function: `updateCPETracker`
   - Source: `Time-driven`
   - Type: `Daily` or `Weekly`

---

## 💡 Ideas for Extension
- Auto-email alerts for upcoming expiration or low CPE counts
- Dashboard for visualizing progress per cert
- Google Form to submit new CPE events
- Export-ready audit report by cert

---

## 🧪 Tips
- Keep `Applicable Certs` and `Proof Uploaded to Portal` fields comma-separated
- Use `Show Overage = Yes` if a cert allows CPEs beyond a category limit
- Certs without `Issued Date` will be skipped as `Planned`

---

## 🛠 Built With
- Google Sheets
- Google Apps Script (JavaScript)
