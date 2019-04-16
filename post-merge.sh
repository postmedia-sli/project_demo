#!/usr/bin/env bash

# Run `npm install` when package.json changes
git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep --quiet "package.json" && npm i
