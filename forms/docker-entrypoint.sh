#!/bin/sh

# based on https://rakhayyat.medium.com/vuejs-on-docker-environment-specific-settings-daf2de660b9

ROOT_DIR=./app

# Replace env vars in JavaScript files
for file in $ROOT_DIR/js/app.*.js*;
do

  echo "Processing $file ...";
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi
  envsubst '$VUE_APP_API_VERSION' < "$file.tmpl.js" > "$file"
  cp $file $file.tmpl.js
  envsubst '$VUE_APP_API_URL' < "$file.tmpl.js" > "$file"
  cp $file $file.tmpl.js
  envsubst '$VUE_APP_SIGNIN_REDIRECT' < "$file.tmpl.js" > "$file"
  cp $file $file.tmpl.js
  envsubst '$VUE_APP_REGISTER_REDIRECT' < "$file.tmpl.js" > "$file"
done
echo "Starting Nginx df"
nginx -g 'daemon off;'