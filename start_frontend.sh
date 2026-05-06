#!/bin/bash
set -e
cd /Users/zousirui/Desktop/评课社区/frontend
# Ensure src symlink points to actual source directory (macOS renames poorly with spaces)
[ -L src ] || ln -sfn "src 2" src
yarn dev
