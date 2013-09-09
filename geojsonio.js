var concat = require('concat-stream'),
    opener = require('opener'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function openData(body) {
    opener('http://geojson.io/#?id=data&data=' + encodeURIComponent(body.toString()));
}
