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
cp -p ./app-tree-items-edit/dist/inline.*.js    ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui/inline.bundle.js
cp -p ./app-tree-items-edit/dist/main.*.js      ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui//main.bundle.js
cp -p ./app-tree-items-edit/dist/polyfills.*.js ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui/polyfills.bundle.js
cp -p ./app-tree-items-edit/dist/styles.*.css   ${TARGETDIR}/weko-items-ui/weko_items_ui/static/css/weko_items_ui/styles.bundle.css
# copy-end

