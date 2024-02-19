#!/bin/bash

function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}


if [ $(program_is_installed zip) == 0 ]; then
   apk update
   apk add zip
fi

if [ $(program_is_installed aws) == 0 ]; then
   apk update
   apk add --no-cache aws-cli
fi

aws s3 sync s3://chat-app-env-files/develop .
unzip env-file.zip
cp .env.develop .env
rm .env.develop
sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env
rm -rf env-file.zip
cp .env .env.develop
zip env-file.zip .env.develop
aws --region eu-central-1 s3 cp env-file.zip s3://chat-app-env-files/develop/
rm -rf .env*
rm -rf env-file.zip