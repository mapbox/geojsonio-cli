#!/usr/bin/env node

var concat = require('concat-stream'),
    opener = require('opener'),
    tty = require('tty'),
    path = require('path'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

if (argv.help || argv.h || !(argv._[0] || !tty.isatty(0))) return help();

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function sendData(json) {
  (argv.print ? console.log : opener)((argv.domain || 'http://geojson.io/') +
      '#data=data:application/json,' + encodeURIComponent(JSON.stringify(json)));
}

function tryParsingAsFeatures(body) {
    var lines = body.toString().split('\n');
          
    var failed = false;
    var features = [];
    for (var i=0; i < lines.length; i++) {
        var line = lines[i];
        if (line[line.length - 1] == ',') {
            line = line.slice(0, line.length - 1);
        }
        if (line == '') {
          continue;
        }
        try {
            var json = JSON.parse(line);
            if (json['type'] != 'Feature') {
                console.error('Line ' + i + ' did not look like a feature ' + JSON.stringify(json));
                failed = true;
            } else {
                features.push(json);
            }
        } catch(e) {
            console.error('Line ' + i + ' could not parse as json: ' + e);
            console.error(line);
            failed = true;
        }
    }

    if (!failed) {
        sendData({
            "type": "FeatureCollection",
            "features": features
        })
    } else {
        console.error('Valid GeoJSON file required as input.');
        help();
    }
}

function openData(body) {
    try {
        sendData(JSON.parse(body.toString()))
    } catch(e) {
        console.error('Trying to parse as lines of features.');
        tryParsingAsFeatures(body.toString());
    }
}

function help() { fs.createReadStream(path.join(__dirname, 'README.md')).pipe(process.stdout); }
