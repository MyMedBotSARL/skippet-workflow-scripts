# static script for workflow (public!)
This repository is for maintenance browser js codes, to be sarved by jsDeliver

## Public Repository
**DO NOT** push any sensitive data to this repository. This **MUST** be a public repository.
JsDeliver can't use private repositories

## Serving
Use this url pattern for serving on any script tag
```url
https://cdn.jsdelivr.net/gh/MyMedBotSARL/skippet-workflow-scripts@{version}/src/{file}{.min}.js
```
- **version:** branch or commit hash
- **file:** your file name inside src folder
- **.min:** to get minified file add `.min` to your js file

For specail serving use jsdeliver [converter](https://www.jsdelivr.com/github)

## Cache
JsDeliver has 7day cache for any file. use [purge tools](https://www.jsdelivr.com/tools/purge) to invalidate onl cache after new changes 