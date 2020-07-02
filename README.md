# Projects and Blog

[My personal blog](https://murphypone.github.io/) containing links to some notable projects, blog posts, essays, and more!

## Use so your donkey-brain doesn't overwrite master w/dev again

1. To update code, commit changes and push to `dev`
2. To deploy those changes, execute `npm run deploy` which will push to master so the page can be easily hosted in ghp.

    - If there are issues with the public/static folder, delete the .cache and public folders in dev branch, `gatsby build` again
    
    - Alternatively, make sure there _is_ a static folder atroot of dev branch and reference static resources acc. to [this](https://www.gatsbyjs.org/docs/static-folder/)