# AWS Website project

## tips

1. set the [node](https://nodejs.org/en/about/previous-releases) version once [fnm](https://github.com/Schniz/fnm) is installed: `echo $(fnm current) > .nvmrc`
2. setup the monorepo with:

```shell
npx projen@latest new typescript \
  -–name "@aws-website/root" \
  -–projenrc-ts \
  -–packageManager "pnpm" \
  -–projenCommand "pnpm dlx projen" \
  -–minNodeVersion v20.12.1 \
  -–sampleCode false
```
