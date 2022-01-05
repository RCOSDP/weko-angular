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
cp -p ./app-tree-items-detail/dist/inline.*.js    ${TARGETDIR}/invenio-communities/invenio_communities/static/js/invenio_communities/inline.bundle.js
cp -p ./app-tree-items-detail/dist/main.*.js      ${TARGETDIR}/invenio-communities/invenio_communities/static/js/invenio_communities/main.bundle.js
cp -p ./app-tree-items-detail/dist/polyfills.*.js ${TARGETDIR}/invenio-communities/invenio_communities/static/js/invenio_communities/polyfills.bundle.js
cp -p ./app-tree-items-detail/dist/styles.*.css   ${TARGETDIR}/invenio-communities/invenio_communities/static/scss/invenio_communities/styles.bundle.css
# copy-end
