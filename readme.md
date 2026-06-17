# @capire/university

This is a result of a short ~30 min ad-hoc incremental 'vibe coding' exercise done in a hand-on session recently. 
With plain Claude Sonnet (4.5), without any SAP or CAP-specific harness (no MCP, no skills, no nothing).

The prompts were like that: 

1. _Add a domain model for university courses_
2. _Add test data_
3. _Add a service for admins_
4. _Add constraints_
5. _Add i18n_
6. _Add a vue.js UI_
7. _Add i18n also to the UI_

( Plus a few tweaks and corrections here and there ;)

## Findings

- Claude, et al, are trained for CAP → through public capire docs & samples (I asked)
- Worked very nice in an incremental evolutionary way
  - which gave me the chance to stay in control and easily correct small mistakes
  - (I still don't believe in waterfalls ;)
- Generated CAP content (mostly cds) ...
  - still is concise (minimal loc) → avoids codebase nightmares and tech debt
  - captures intent → as it was designed for from the beginning
  - human-readable → made it easy for me to validate each step's outcomes
  - After step 1 I asked "create a simple ER diagram", [so it did](https://github.com/capire/university/blob/main/_docs/er-diagram.svg) → also helped to validate
- There are knowledge gaps, of course, due to gaps in capire or release date cutoffs
  - but these were easy to bridge ad hoc, e.g. on step 4 it didn't yet know about `@assert`
  - So I dropped the link to the latest doc, and after 5 second it spit out a nice set of constraints
- It placed some i18n files in wrong places → I simply moved the to the right place

That's the baseline we took to work on a curated set of skills to smoothen the edges. 


## Run it

Assumed you're [setup for local CAP development](https://cap.cloud.sap/docs/get-started/):

```sh
git clone https://github.com/capire/university
cds watch university
open http://localhost:4004/courses/index.html
```

