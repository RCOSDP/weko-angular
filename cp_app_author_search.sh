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
cp -p ./app-author-search/dist/inline.*.js    ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/inline.search.bundle.js
cp -p ./app-author-search/dist/main.*.js      ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/main.search.bundle.js
cp -p ./app-author-search/dist/polyfills.*.js ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/polyfills.search.bundle.js
cp -p ./app-author-search/dist/styles.*.css   ${TARGETDIR}/weko-authors/weko_authors/static/css/weko_authors/styles.search.bundle.css
# copy-end
