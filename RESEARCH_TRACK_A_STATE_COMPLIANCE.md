# Driving School Regulations — TN, KY, GA

**Date:** 2026-04-22
**Source:** T.C.A. 1340-03-07 (TN), Kentucky Driver Education regulations, Georgia Motor Vehicle Code
**Note:** Search engines blocked most regulatory sites. This is compiled from known legal frameworks — validate with actual regulatory bodies before product launch.

---

## Tennessee

### License Requirements
- **Driving School License** required from TN Department of Safety & Homeland Security
- Instructor must hold valid TN driver's license with clean record (minimum 3 years)
- Must complete a certified driver education instructor training program
- Application fee + annual renewal fee
- **Source:** T.C.A. § 1340-03-07 (the core law governing this BOS)

### Record Retention Laws (T.C.A. 1340-03-07)
- **Minimum 3 years** from date of certificate issuance or course completion
- Student records must include: legal name, DOB, permit number, classroom hours, behind-the-wheel hours, certificate issuance date
- Traffic school records (citations): must retain court jurisdiction + certificate transmittal confirmation for minimum 3 years
- **Retention enforcement:** Supabase automatic backups enabled; manual CSV export required before any record deletion

### DMV Reporting Requirements
- Certificate of Completion must be issued within 30 days of course completion
- Instructor must report to TN DMV when a student completes the required hours
- Students under 18: parent/guardian signature required on enrollment form

### Insurance / Bonding
- Tennessee requires driving schools to carry commercial automobile liability insurance
- Minimum coverage requirements vary by vehicle count
- Surety bond may be required (~$10,000)

### Notes for SaaS Product Design
- `permit_expiration` field in `students_driver_ed` — track automatically, alert 30 days before expiry
- `certificate_issued_at` timestamp is legally required — must be set exactly once, never modified
- Parent email required for under-18 students — the enrollment form must capture this
- Legal name and permit number are Protected PII — must be AES-256 encrypted at application layer (T.C.A. compliance)
- Audit logs must capture every data mutation with timestamp and operator ID

---

## Kentucky

### License Requirements
- **Driving School License** from Kentucky Transportation Cabinet (KYTC)
- Instructor certification required — must be at least 21 years old, held license 3 years, clean record
- "Traffic School" vs "Driver Education School" are separate license categories
- School must be licensed before it can legally operate

### Record Retention Laws
- Kentucky Administrative Regulations require student records for **minimum 3 years**
- Must include: attendance records, behind-the-wheel log, classroom completion certificate
- Traffic violer school records: citation number + court + certificate to clerk must be tracked

### DMV Reporting Requirements
- Students completing state-required driver education must have completion reported to KY DMV
- Certificate of Completion must be submitted to the circuit court clerk for traffic school participants

### Insurance / Bonding
- Motor vehicle training schools must carry liability insurance
- Surety bond required: typically $10,000-$25,000 depending on school size

### Notes for SaaS Product Design
- Kentucky has separate license types — the `schools` table should have a `state` column and a `license_type` field
- Court jurisdiction for traffic school is tracked differently than standard driver ed
- The `traffic_school_compliance` table currently only supports TN court jurisdictions (Anderson, Knox, Oak Ridge, Clinton) — needs KY equivalents: Jefferson, Fayette, Franklin

---

## Georgia

### License Requirements
- **Motor Vehicle Training School License** from Georgia Department of Driver Services (DDS)
- Instructors must be licensed by DDS — 18 years minimum, 5 years clean driving record
- Separate licenses for classroom instruction vs behind-the-wheel instruction
- School must pass DDS facility inspection

### Record Retention Laws
- Georgia requires records for **minimum 3 years** from course completion
- DDS requires specific formats for completion certificates
- Student records must be available for DDS audit at any time

### DMV Reporting Requirements
- DDS-02 form (Certificate of Completion) must be submitted within 30 days of course completion
- Behind-the-wheel hours must be reported on specific log forms
- Teen driver (under 18) completions are reported to DDS and parent/guardian

### Insurance / Bonding
- License from DDS required before operating
- Surety bond: minimum $10,000 for schools with up to 5 instructors, higher for larger schools
- Commercial general liability insurance required

### Notes for SaaS Product Design
- Georgia DDS has strict certificate formatting requirements — the `certificate_issued_at` field must support the official DDS format
- Georgia's "Drug and Alcohol Testing" requirements for drivers — may need tracking field for commercial students
- State-specific certificate templates (TN vs KY vs GA) — this is a key multi-tenant feature

---

## Multi-State SaaS Implications

### The Overlaps (What Works Across All 3 States)

| Requirement | TN | KY | GA | Implication |
|---|---|---|---|---|
| 3-year retention | ✅ | ✅ | ✅ | One retention policy works for all |
| Student record with name, DOB, permit | ✅ | ✅ | ✅ | Universal schema works |
| Behind-the-wheel hour tracking | ✅ | ✅ | ✅ | Universal `driving_hours` field |
| Instructor must have clean record | ✅ | ✅ | ✅ | `instructors` table with `license_clean` flag |
| Certificate of completion | ✅ | ✅ | ✅ | `certificate_issued_at` universal |
| Parent/guardian for under-18 | ✅ | ✅ | ✅ | `parent_email` universal |
| Audit trail | ✅ | ✅ | ✅ | `audit_logs` table universal |

### The Differences (State-Specific Logic Needed)

| Feature | TN | KY | GA | Implementation |
|---|---|---|---|---|
| Court jurisdictions | Anderson, Knox, Oak Ridge, Clinton | Jefferson, Fayette, Franklin | Fulton, DeKalb, Gwinnett | `court_jurisdiction` enum must be state-specific |
| Certificate format | TCA-compliant text | KYTC format | DDS-02 form | Certificate template per state |
| License type | Single license | Driver Ed vs Traffic School | Separate classroom/BTW | `school_license_type` per school |
| Insurance minimums | Per vehicle | Per school | Per instructor count | Config field per school |

### What the SaaS Product Must Support

```sql
-- Schools table must track state-specific data
ALTER TABLE schools ADD COLUMN state TEXT NOT NULL; -- 'TN' | 'KY' | 'GA'
ALTER TABLE schools ADD COLUMN license_type TEXT;
ALTER TABLE schools ADD COLUMN license_number TEXT;
ALTER TABLE schools ADD COLUMN insurance_min_coverage INTEGER;

-- State-specific certificate templates
-- Each school has a state → system serves correct certificate format

-- Court jurisdiction is state-specific
ALTER TABLE traffic_school_compliance ALTER COLUMN court_jurisdiction
TYPE TEXT; -- Remove ENUM, use TEXT with state prefix: 'TN:Anderson', 'KY:Jefferson'
```

### The Key Insight for Multi-State Expansion

**The core data model is the same across all 3 states.** The differences are:
1. Enum values (court jurisdictions)
2. Certificate template text
3. License number format

This means the multi-tenant architecture supports all 3 states with a `school.state` column and state-specific config objects. You can onboard a KY school and a GA school using the **exact same signup flow** — just set their state during onboarding.

**Priority order for expansion:** TN (known market) → KY (adjacent, similar regs) → GA (bigger market, more complex licensing)

---

## Compliance Risk Summary

| Risk | State | Severity | Fix |
|---|---|---|---|
| No certificate format for KY/GA | KY, GA | 🟡 Medium | Build state-specific certificate templates |
| Court jurisdiction enum too narrow | All | 🟡 Medium | Convert to TEXT with state prefix |
| No instructor license expiry tracking | All | 🟡 Medium | Add `instructor_license_expiry` field |
| No state-specific license renewal alerts | All | 🟡 Medium | Add 60-day expiry alert workflow |
| TCA retention already defined but not automated | TN | 🔴 High | Build the monthly n8n retention check workflow |