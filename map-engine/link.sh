#!/bin/sh
# copy the shared engine into a film folder: sh map-engine/link.sh map-<name>
E=$(cd "$(dirname "$0")" && pwd); F=$1
cp "$E/index.html" "$F/index.html"; mkdir -p "$F/fonts"; cp "$E"/fonts/* "$F/fonts/"
