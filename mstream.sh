#!/bin/bash

if [[ ${1} == 'build' ]];
then
  docker build -t mstream:latest .
else
  mkdir -p output
  docker run --rm -it -v ${PWD}/output:/usr/src/app/output mstream:latest npm run start
fi
