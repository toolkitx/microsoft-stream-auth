#!/bin/bash

# docker build -t mstream:latest .
docker run --rm -it -v ${PWD}:/usr/src/app mstream:latest npm run start
