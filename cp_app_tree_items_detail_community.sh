#!/usr/bin/env bash

# quit on errors and unbound symbols:
set -o errexit

# args-check-begin
if [ ! -d "$1" ]; then
    echo "Usage: $0 wekodir"
    exit 1
fi
WEKODIR=$1

if [ ! -d "${WEKODIR}/invenio_communities" ]; then
    echo "No such ${WEKODIR}/invenio_communities/"
    exit 1
fi
TARGETDIR=$WEKODIR/invenio_communities
# args-check-end

# copy-begin
cp -p ./app-tree-items-detail/dist/inline.*.js    ${TARGETDIR}/static/js/invenio_communities/inline.bundle.js
cp -p ./app-tree-items-detail/dist/main.*.js      ${TARGETDIR}/static/js/invenio_communities/main.bundle.js
cp -p ./app-tree-items-detail/dist/polyfills.*.js ${TARGETDIR}/static/js/invenio_communities/polyfills.bundle.js
cp -p ./app-tree-items-detail/dist/styles.*.css   ${TARGETDIR}/static/css/invenio_communities/styles.bundle.css
# copy-end
