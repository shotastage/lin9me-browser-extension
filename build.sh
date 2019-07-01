#!/usr/bin/env bash

function compile() {
    ./node_modules/.bin/node-sass ./styles/popup.scss ./build/popup.css
    ./node_modules/.bin/pug ./ -o ./build/
}


function build_firefox() {

    FF_BASE="./dist/firefox"

    echo $FF_BASE

    if [ -e $FF_BASE ]; then
        rm -rf $FF_BASE
    fi

    mkdir -p $FF_BASE
    cp firefox-manifest.json $FF_BASE/manifest.json
    cp popup-firefox.js $FF_BASE/popup.js
    cp icon.png $FF_BASE/icon.png
    cp -r ./build/ $FF_BASE/build/

    zip -r ./dist/lin9me-ext-firefox.zip $FF_BASE
}

compile
build_firefox
