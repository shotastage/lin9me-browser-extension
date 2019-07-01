#!/usr/bin/env bash

function compile() {
    ./node_modules/.bin/node-sass ./styles/popup.scss ./build/popup.css
    ./node_modules/.bin/pug ./ -o ./build/
}

compile
