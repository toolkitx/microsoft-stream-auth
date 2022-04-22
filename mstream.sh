#!/bin/bash

# docker build -t mstream:latest .
docker run --rm -it -v ${PWD}:/usr/src/app mstream:latest node --max-http-header-size=800000 index.js
