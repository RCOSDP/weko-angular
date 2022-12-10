#!/usr/bin/env bash

# quit on errors and unbound symbols:
set -o errexit

# args-check-begin
if [ ! -d "$1" ]; then
    echo "Usage: $0 wekodir"
    exit 1
fi
WEKODIR=$1

if [ ! -d "${WEKODIR}/modules" ]; then
    echo "No such ${WEKODIR}/modules/"
    exit 1
fi
TARGETDIR=$WEKODIR/modules
# args-check-end

# copy-begin
cp -p ./app-tree-items-detail/dist/runtime.*.js    ${TARGETDIR}/weko-theme/weko_theme/static/js/weko_theme/inline.bundle.js
cp -p ./app-tree-items-detail/dist/main.*.js      ${TARGETDIR}/weko-theme/weko_theme/static/js/weko_theme/main.bundle.js
cp -p ./app-tree-items-detail/dist/polyfills.*.js ${TARGETDIR}/weko-theme/weko_theme/static/js/weko_theme/polyfills.bundle.js
cp -p ./app-tree-items-detail/dist/styles.*.css   ${TARGETDIR}/weko-theme/weko_theme/static/css/weko_theme/styles.bundle.css
# copy-end
