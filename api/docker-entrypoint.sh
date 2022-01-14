#!/bin/sh
set -e

#--unstable --import-map=import_map.json 

deno run -A ${DENO_RUN_OPTIONS} Drakefile.ts gen-secret

deno run -A ${DENO_RUN_OPTIONS} Drakefile.ts seed

echo "The Dockerfile ENTRYPOINT '${BACKEND_ENTRYPOINT}' has been executed!"

exec ${BACKEND_ENTRYPOINT} "$@"
