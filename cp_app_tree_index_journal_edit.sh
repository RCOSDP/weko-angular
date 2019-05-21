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
cp -p ./app-tree-index-journal-edit/dist/inline.*.js    ${TARGETDIR}/weko-indextree-journal/weko_indextree_journal/static/js/weko_indextree_journal/inline.bundle.js
cp -p ./app-tree-index-journal-edit/dist/main.*.js      ${TARGETDIR}/weko-indextree-journal/weko_indextree_journal/static/js/weko_indextree_journal/main.bundle.js
cp -p ./app-tree-index-journal-edit/dist/polyfills.*.js ${TARGETDIR}/weko-indextree-journal/weko_indextree_journal/static/js/weko_indextree_journal/polyfills.bundle.js
cp -p ./app-tree-index-journal-edit/dist/styles.*.css   ${TARGETDIR}/weko-indextree-journal/weko_indextree_journal/static/css/weko_indextree_journal/styles.bundle.css
# copy-end
