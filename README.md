# BenchMatch demo

BenchMatch reduces the manual work of checking a candidate against roles copied from a demand sheet. It is a small, fictional, front-end demonstration: there is no backend, and files are read locally in the browser.

## What works

- Edit the candidate's grade, comma-separated skills, relevant experience, and preferred location. The same profile values drive the visible inputs and role checks.
- Import an Excel demand sheet after saving it as CSV. The importer validates the required columns, reports row and format problems, and does not send the file anywhere.
- Download a fictional CSV example generated from the six built-in roles, or restore those roles with **Load sample data**.
- Search roles and apply an explicit location filter together. London remains a preference and does not filter or rank results automatically.
- See one result per role: **Meets listed requirements**, **Gaps to review**, or **Needs confirmation**, plus the actual skills, grade, and experience explanations.

## CSV columns

The CSV must include `Title`, `Client`, `Location`, `Accepted Grades`, `Required Skills`, and `Minimum Relevant Experience (Years)`. Separate multiple grades and skills with `|`. Leave a role detail blank when it is unknown; that check will need confirmation. The role title is required. Extra columns are ignored.

## Matching rules

- Skill names are compared exactly, ignoring letter case. Missing required skills are gaps.
- A grade passes only when that exact grade is explicitly listed; no equivalences are assumed.
- Experience passes when the entered years meet or exceed the stated minimum.
- Any known failed check makes the result **Gaps to review**. If there are no known failures but a check is missing, the result is **Needs confirmation**. Only three known passes produce **Meets listed requirements**.
- The preferred location is informational. It affects results only if the user chooses the location dropdown.
- There are no match percentages, rankings, AI, or inferred requirements.

## Two-minute demonstration

1. Start with the fictional profile and six sample roles. Change the grade or experience and point out how the checks update immediately.
2. Change the skills field to `React, QA Testing` and show how matching and missing skills change. Change preferred location; the role list does not filter.
3. Use **Download fictional example** to inspect the CSV columns, then choose a CSV to import. Point out that blank role details need confirmation.
4. Search for `Playwright`, select **Bristol**, and show the combined filter. Use **Clear filters** or **Load sample data** to reset the list.

## How the code works

- `index.html` contains the labelled candidate fields, CSV controls, search and location filters, and role list.
- `app.js` stores the candidate and fictional sample roles. It parses and validates CSV, compares each role with the same candidate object, then creates the result cards using safe text nodes.
- `styles.css` keeps the compact responsive layout and status colors.

This is a single-candidate, rules-based POC. It supports CSV rather than reading `.xlsx` files directly; there is no CV parsing, application tracking, login, database, or AI service. The current workspace has no Node.js/npm or React project setup, so this version stays dependency-free HTML, CSS, and JavaScript rather than adding an unapproved toolchain.

## Open the demo

Try the [live demo](https://adriangeorgem1.github.io/benchmatch-demo/), or open `index.html` in a modern browser.
