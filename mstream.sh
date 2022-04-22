#!/bin/bash

# docker build -t mstream:latest .
mkdir -p output
docker run --rm -it -v ${PWD}/output:/usr/src/app/output mstream:latest npm run start
