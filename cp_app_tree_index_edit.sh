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
cp -p ./app-tree-index-edit/dist/inline.*.js    ${TARGETDIR}/weko-index-tree/weko_index_tree/static/js/weko_index_tree/inline.bundle.js
cp -p ./app-tree-index-edit/dist/main.*.js      ${TARGETDIR}/weko-index-tree/weko_index_tree/static/js/weko_index_tree/main.bundle.js
cp -p ./app-tree-index-edit/dist/polyfills.*.js ${TARGETDIR}/weko-index-tree/weko_index_tree/static/js/weko_index_tree/polyfills.bundle.js
cp -p ./app-tree-index-edit/dist/styles.*.css   ${TARGETDIR}/weko-index-tree/weko_index_tree/static/css/weko_index_tree/styles.bundle.css
# copy-end
