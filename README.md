# AWS Website project

## todo

* look at <https://github.com/adrian-goe/nx-aws-cdk-v2>
* look at <https://aws.github.io/aws-pdk/overview/index.html>
* look at <https://github.com/projen/projen>

## tips

0. using <https://cevo.com.au/devops/setup-a-monorepo-using-nx-projen-and-github-actions/> as a reference as the [aws-pdk](https://aws.github.io/aws-pdk/overview/index.html) project wasn't suiting my needs
1. set the [node](https://nodejs.org/en/about/previous-releases) version once [fnm](https://github.com/Schniz/fnm) is installed: `echo $(fnm current) > .nvmrc`
2. setup the monorepo with:`npx projen@latest new typescript -–name "@aws-website/root" -–projenrc-ts -–packageManager "pnpm" -–projenCommand "pnpm dlx projen" -–minNodeVersion v20.12.1 -–sampleCode false`
3. subsequent changes need to be run through: `pnpm projen`
4. show projects: `npx nx show projects`
