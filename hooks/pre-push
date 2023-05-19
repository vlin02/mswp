GIT_ROOT=$(git rev-parse --show-toplevel)

cd $GIT_ROOT/packages/extension
pnpm webpack:prod

cp dist/prod/* $GIT_ROOT/builds/mswp-chrome