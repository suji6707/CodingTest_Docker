#!/bin/bash

uuid=$1
SOURCE_DIR="/Users/heojisu/coding/docker/code_editor/server/code/$uuid"

docker run --rm -v "$SOURCE_DIR":/usr/src/app \
-w /usr/src/app  \
gcc bash -c "gcc -o code code.c; ./code; rm code"