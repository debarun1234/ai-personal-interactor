# Research Playbook — From Idea to Published Paper

**Purpose:** A comprehensive, reusable guide that anyone (and Debarun's AI bot) can follow to take a research idea from zero → paper → artifacts. Includes stage‑by‑stage checklists, templates, do's & don'ts, ethical safeguards, and publishing tactics.

---

## 0) Lifecycle at a Glance (Stage Gates)
1. **Problem Framing** → *Gate:* Clear, valuable question & success criteria.  
2. **Literature Review** → *Gate:* Gap validated; novelty statement drafted.  
3. **Method Design** → *Gate:* Hypotheses, metrics, datasets/simulators, baselines fixed.  
4. **Experiment Plan** → *Gate:* Protocols, power analysis (if applicable), preregistration optional.  
5. **Implementation** → *Gate:* Reproducible code/env; logging & versioning on.  
6. **Evaluation** → *Gate:* Results with ablations, error analysis, robustness.  
7. **Writing** → *Gate:* IMRaD draft, figures, tables, claims ↔ evidence mapped.  
8. **Peer Review (Internal)** → *Gate:* Checklist pass; revisions done.  
9. **Submission** → *Gate:* Formatting, ethics forms, artifacts packaged.  
10. **Post‑Decision** → *Gate:* Rebuttal/camera‑ready; release code/data; comms plan.

---

## 1) Problem Framing (Start Here)
**Goal:** Define a problem that is valuable, feasible, and measurable.
- **User/Stakeholder:** Who benefits from the result (industry, academia, public)?
- **Value Proposition:** Why now? Why this is hard? What changes if solved?
- **Scope:** One sentence each—*In*, *Out*, *Assumptions*.
- **Success Criteria:** Primary metric(s), constraints, and minimal acceptable improvement.
- **Risks:** Data access, compute cost, ethics/IRB, timeline, novelty risk.

**Template:**  
> *We study* __[phenomenon/system]__ *to* __[improve/understand]__ *by* __[method]__. *Success means* __[metric target]__ *under* __[constraints]__.

---

## 2) Literature Review (Structured & Efficient)
**Objectives:** Map the space; identify the gap; collect baselines.
- **Search Plan:** Keywords + synonyms; top venues; recent 2–3 years; seminal older work.
- **Triage:** Skim abstracts → shortlist → deep read methods/results.
- **Synthesis:** Group by approach (e.g., heuristic vs. learning), dataset/simulator, metrics.
- **Gap Statement:** *Existing work does X on Y with Z; none address A under B constraints.*
- **Artifact Audit:** Which papers release code/data? Reuse what you can.

**PRISMA‑style Log (lightweight):**  
`found → screened → included → excluded (with reasons)`

**Do:** keep a living spreadsheet (title, venue, year, method, data, metrics, code link, takeaways).  
**Don’t:** rely on abstracts only; copy text—always paraphrase and cite.

---

## 3) Research Question, Hypotheses, and Claims
- **RQ:** Narrow and testable.  
- **Hypotheses:** H₁/H₂ with expected direction of effect.  
- **Claims → Evidence:** Draft the exact tables/figures needed to prove each claim.

**Claim‑to‑Evidence Map (example):**  
| Claim | Evidence | Status |
|---|---|---|
| Method reduces energy ≥ 15% vs. baseline | Table of energy/bit; CI; significance test | TODO |
| Robust under diurnal load shifts | Sensitivity curves; nighttime vs daytime | TODO |

---

## 4) Method Design (Choose Your Track)
Pick the track(s) that fit your project; combine as needed.

### A) Empirical/Data‑Driven
- **Data:** Source, licenses, preprocessing, train/val/test splits; data card.  
- **Metrics:** Accuracy/ROC‑AUC/F1; regression errors; calibration; fairness metrics if applicable.  
- **Baselines:** Strong, simple, and state‑of‑the‑art.  
- **Stats Plan:** Test selection, effect sizes, confidence intervals, multiple‑test control.

### B) Experimental/Systems
- **Setup:** Hardware, OS, libraries; workload generators; resource limits.  
- **KPIs:** Throughput, latency, tail percentiles, energy use, cost.  
- **Ablations:** Remove components to quantify contributions.  
- **Robustness:** Fault injection, load spikes, cross‑version tests.

### C) Simulation (e.g., networks/5G)
- **Simulator/Model:** Version, parameters, topology; random seeds.  
- **Scenarios:** Base, stress, extreme; diurnal profiles.  
- **KPIs:** Domain‑specific (e.g., energy/bit, coverage %, BLER).  
- **Validation:** Compare to analytical results or real traces.

### D) Theoretical/Algorithmic
- **Assumptions:** Clearly stated; realistic bounds.  
- **Proof Plan:** Lemma → theorem structure; edge cases; counter‑examples.  
- **Complexity:** Tight upper/lower bounds; practical implications.

---

## 5) Experiment Plan (Pre‑Spec)
- **Design:** Randomization, controls, blocking, or cross‑validation.  
- **Power & N:** If statistical tests, estimate sample sizes/effect sizes.  
- **Protocol:** Step‑by‑step, including hyper‑parameter grids and early‑stopping rules.  
- **Failure Criteria:** When to abort/rollback.  
- **Preregistration (optional):** Lock plan to avoid p‑hacking.

**Experiment Log Template:**  
`ID | date | code commit | seed | data version | params | metrics | notes`

---

## 6) Implementation & Reproducibility
- **Repo Layout:** `src/`, `configs/`, `scripts/`, `data/`(or pointers), `experiments/`, `results/`, `docs/`.  
- **Environment:** `requirements.txt` or `environment.yml`; container (Dockerfile); exact versions.  
- **Determinism:** Seeds, cuDNN flags; document non‑deterministic ops.  
- **Tracking:** MLflow/W&B or simple CSV logs + plots; save configs+metrics per run.  
- **Continuous Validation:** Unit tests for metrics/data loaders; smoke tests for training/inference.  
- **Licensing:** Respect dataset/model licenses; add `LICENSE` and `CITATION.cff`.

---

## 7) Analysis & Statistics (Choose Wisely)
- **Always report:** Means + standard deviations, **and** confidence intervals.  
- **Tests:**  
  - Compare 2 groups → t‑test/Mann‑Whitney (normality check).  
  - >2 groups → ANOVA/Kruskal‑Wallis + post‑hoc.  
  - Paired designs → paired t‑test/Wilcoxon.  
  - Correlation → Pearson/Spearman.  
- **Effect Sizes:** Cohen’s d, η²; not just p‑values.  
- **Multiple Comparisons:** Holm/Bonferroni or FDR control.  
- **Visualization:** Box/violin for distributions, not only bar charts; include raw points if possible.  
- **Error Analysis:** Slice by scenario; analyze failure modes.

---

## 8) Robustness, Sensitivity, and Ablations
- **Ablations:** Remove components/features to show their contribution.  
- **Sensitivity:** Vary key hyper‑parameters; produce response curves.  
- **Stress Tests:** Domain shifts, noise, load spikes, adversarial conditions.  
- **Generalization:** Cross‑dataset/cross‑topology where relevant.

---

## 9) Writing the Paper (IMRaD + Checklists)
### Title & Abstract
- **Title:** Precise, scoped, benefit‑driven.  
- **Abstract:** Problem → method → results → key numbers → takeaway.

### Introduction
- Context and gap; contributions as bullet points; why it matters.  
- State claims and summarize evidence to come.

### Related Work
- Organize by idea/dimension; compare/contrast; cite code/data when available.

### Method
- Clear notation, diagrams, and algorithms.  
- Assumptions and limitations stated up front.  
- Pseudocode where helpful.

### Experiments
- Datasets/simulators, baselines, metrics, protocols.  
- Present tables/plots with readable captions; mark statistically significant gains.  
- Include ablations, sensitivity, and error analysis.

### Discussion
- Interpret results; domain implications; limitations; future work.

### Conclusion
- One paragraph: what was done, what was learned, and what’s next.

### References
- Follow venue style; verify each citation; avoid non‑existent references.

**Figure/Caption Best Practices:**  
- Self‑contained captions describing setup, metric, and key takeaway.  
- Legible fonts; consistent units; avoid rainbow palettes; sort legends by value.  
- Never cherry‑pick crops or truncate axes to mislead.

---

## 10) Internal Peer Review
- **Red Team Read:** Ask a colleague to actively find flaws.  
- **Checklists:** Methods clarity, reproducibility, stats correctness, ethical compliance.  
- **Dry‑Run Talk:** 10‑minute slide deck to surface logic gaps.

---

## 11) Venue & Submission Strategy
- **Fit:** Scope, audience, acceptance rates, artifact policies, page limits.  
- **Formatting:** Use the official template early; enforce references style.  
- **Artifacts:** Submit code/data/models if allowed; anonymize if double‑blind.  
- **Cover Letter (if applicable):** State novelty and relevance succinctly.

**Rebuttal Template (short):**  
> *We thank the reviewers.* **R1:** [claim] — *Response with evidence (pointer to section/table).* **R2:** …  
Keep factual, concise, and respectful.

---

## 12) After Decision
- **Accept:** Camera‑ready edits; artifact DOIs; website/blog; social/press kit.  
- **Reject:** Integrate feedback; strengthen baselines; resubmit to best‑fit venue.  
- **Replication:** Encourage independent re‑runs; host issues board.

---

## 13) Ethics, Compliance, and Integrity (Non‑Negotiable)
- **No Fabrication/Falsification/Plagiarism.** Paraphrase; cite; keep raw logs.  
- **Human Subjects/Privacy:** IRB/ethics review; consent; data minimization; anonymization.  
- **Sensitive/Regulated Data:** Follow licenses, export controls, and org policy.  
- **LLM/AI Assistance:** Disclose use. Verify facts/citations; never invent references.  
- **Dual Use & Safety:** Consider misuse; include mitigations and limitations.

---

## 14) Do’s & Don’ts (Quick Reference)
**Do**  
- Start writing early—maintain a living outline.  
- Lock strong baselines; report negative results if informative.  
- Share code and seeds; package a one‑command repro script.  
- Keep a changelog and an experiments ledger.

**Don’t**  
- P‑hack or over‑fit to benchmarks.  
- Hide adverse cases; cherry‑pick only the best run.  
- Ignore license/IRB requirements.  
- Submit without an internal review pass.

---

## 15) Repro Pack (What to Release)
- **Code:** Minimal repo with `README` and quick‑start.  
- **Environment:** Dockerfile or `environment.yml`; pinned versions.  
- **Data:** Download script or pointers; data card with licenses.  
- **Configs & Seeds:** Include the exact configs for main tables/figures.  
- **Results:** CSVs for plots; script to regenerate figures.  
- **Model Card (if ML):** Intended use, limitations, ethics.  
- **CITATION.cff & LICENSE**

---

## 16) Timelines (Example Plans)
**8‑Week Sprint (simulation/empirical)**  
- W1: framing + lit review; W2: design + baselines; W3‑4: implementation; W5: eval v1; W6: ablations/sensitivity; W7: writing; W8: internal review + submission.

**12‑Week Extended**  
- Add prereg/power analysis; expand datasets/scenarios; double pass on writing and reviews.

---

## 17) Roles (RACI) — Even if Solo
- **Responsible:** daily work (you).  
- **Accountable:** final sign‑off (PI/lead).  
- **Consulted:** domain experts, stats advisor.  
- **Informed:** collaborators, stakeholders.

---

## 18) Prompt Library (for Debarun’s AI Bot)
**Paper Intake**  
- *“Summarize this paper in 6 bullets: problem, method, data/sim, metrics, results (with numbers), limitations.”*  
- *“Extract all equations and define symbols.”*  
- *“Build a claim→evidence table from this PDF.”*

**Design Aid**  
- *“Given RQ: __, propose 3 baseline methods, 3 datasets/simulators, and 5 KPIs.”*  
- *“Draft an ablation plan and sensitivity grid for parameters __.”*

**Writing**  
- *“Convert this outline to IMRaD; flag missing evidence; generate figure captions that state key takeaways.”*  
- *“Rewrite methods for clarity; add pseudocode with inputs/outputs and complexity.”*

**Repro**  
- *“Create a minimal Dockerfile and README to reproduce Table 2 (Ubuntu 22.04, Python 3.11).”*

**Review/Revision**  
- *“Act as a critical reviewer; list top 10 weaknesses and suggested fixes with priority.”*

---

## 19) Section Templates (Fill‑in‑the‑Blanks)
**Introduction:**  
> We address __[problem]__ because __[impact]__. Prior work __[summary]__ leaves a gap in __[gap]__. Our contributions are: (1) __; (2) __; (3) __.

**Method:**  
> We model __ with assumptions __. The algorithm comprises __. Complexity is __. Key hyper‑parameters are __.

**Experiments:**  
> We evaluate on __ datasets/simulators with baselines __. Metrics include __. Protocol: __. Results: __ (± __, 95% CI), showing __.

**Limitations & Ethics:**  
> Our approach may fail when __; it requires __ resources. Data contains __ risks; we mitigate by __.

---

## 20) Risk Register & Mitigations
- **Novelty risk:** Pre‑survey niche venues; differentiate via new setting or metric.  
- **Data access risk:** Prepare substitutes; simulate; apply for access early.  
- **Compute risk:** Budget; use smaller proxies; profile early.  
- **Timeline risk:** Set interim deliverables; de‑scope options.

---

## 21) Glossary (Quick)
- **IMRaD:** Introduction, Methods, Results, and Discussion.  
- **Ablation:** Removing components to quantify their impact.  
- **Effect size:** Magnitude of difference (practical significance).  
- **CI:** Confidence interval.

---

### Final Checklist (Submit Only If All ✓)
- [ ] Clear RQ and novelty statement  
- [ ] Strong baselines + fair protocols  
- [ ] Stats sound: tests, CIs, effect sizes  
- [ ] Ablations, sensitivity, robustness  
- [ ] Ethics & licenses cleared  
- [ ] Repro pack builds end‑to‑end  
- [ ] Paper passes internal review  
- [ ] Venue template & page limits obeyed

