#!/bin/sh

sdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $sdir
cd ..
rdir=$PWD

git submodule update --remote --force --recursive _includes
cp scripts/pre-commit .git/hooks
