#!/bin/bash

# docker build -t mstream:latest .
docker run -it -v ${PWD}:/usr/src/app mstream:latest npm test
