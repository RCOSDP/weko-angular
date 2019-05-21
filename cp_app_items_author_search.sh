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
cp -p ./app-items-author-search/dist/inline.*.js    ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui/inline.items.authorSearch.bundle.js
cp -p ./app-items-author-search/dist/main.*.js      ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui/main.items.authorSearch.bundle.js
cp -p ./app-items-author-search/dist/polyfills.*.js ${TARGETDIR}/weko-items-ui/weko_items_ui/static/js/weko_items_ui/polyfills.items.authorSearch.bundle.js
cp -p ./app-items-author-search/dist/styles.*.css   ${TARGETDIR}/weko-items-ui/weko_items_ui/static/css/weko_items_ui/styles.items.authorSearch.bundle.css
# copy-end
