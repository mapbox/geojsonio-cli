#!/usr/bin/env node

var concat = require('concat-stream'),
    opener = require('opener'),
    tty = require('tty'),
    path = require('path'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

if (argv.help || argv.h || !(argv._[0] || !tty.isatty(0))) return help();

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function openData(body) {
    try {
        (argv.print ? console.log : opener)((argv.domain || 'http://geojson.io/') +
            '#data=data:application/json,' + encodeURIComponent(
            JSON.stringify(JSON.parse(body.toString()))));
    } catch(e) {
        console.error('Valid GeoJSON file required as input.');
        help();
    }
}

function help() { fs.createReadStream(path.join(__dirname, 'README.md')).pipe(process.stdout); }
