#!/bin/sh

dir="$( cd "$( dirname "$0" )" && pwd )"
project_root="$(realpath "$dir/..")" # Relative path from this script to project's

for entry in "$project_root/packages/"*
do
  if [ -d "$entry" ]; then
    pkg="$(basename "$entry")"
    path="$project_root/packages/$pkg"
    npm_version="$(npm view @typestry/identity version)"
    pkg_version="$(jq -r '.version' "$path/package.json")"

    if [ "$npm_version" != "$pkg_version" ]
    then
      echo "@typestry/${pkg}@${pkg_version} not published yet"
      npm publish --workspace "packages/${pkg}" --provenance --access public
    fi
  fi
done
