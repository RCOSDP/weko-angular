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
cp -p ./app-author-prefix/dist/inline.*.js    ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/inline.prefix.bundle.js
cp -p ./app-author-prefix/dist/main.*.js      ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/main.prefix.bundle.js
cp -p ./app-author-prefix/dist/polyfills.*.js ${TARGETDIR}/weko-authors/weko_authors/static/js/weko_authors/polyfills.prefix.bundle.js
cp -p ./app-author-prefix/dist/styles.*.css   ${TARGETDIR}/weko-authors/weko_authors/static/css/weko_authors/styles.prefix.bundle.css
# copy-end
