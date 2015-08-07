# geojsonio-cli

Shoot files from your shell to [geojson.io](http://geojson.io/) for lightning-fast
visualization and editing. This is a [node.js](http://nodejs.org) module and thus requires
node.

Read or pipe a file

    geojsonio map.geojson
    geojsonio < run.geojson

Options:

    --print prints the url rather than opening it
    --domain="http://custominstancedomain.com/"

## installation

    npm install -g geojsonio-cli

## examples

[pipe wkt through wellknown into geojsonio to get magic](https://github.com/mapbox/wellknown):

```sh
npm install -g geojsonio-cli
npm install -g wellknown
echo "MultiPoint(0 0, 1 1, 3 3)" | wellknown | geojsonio
```

[pipe grep'ed geojson through geojsonify](https://github.com/blackmad/geojsonify):

```sh
npm install -g geojsonio-cli
npm install -g geojsonify
grep -h something *json | geojsonify | geojsonio
```

[convert kml or gpx to geojson and push it to geojson.io](https://github.com/mapbox/togeojson):

```sh
npm install -g geojsonio-cli
npm install -g togeojson
togeojson foo.kml | geojsonio
```

copy the generated url instead of opening it in a browser (on OSX)

```sh
geojsonio foo.geojson --print | pbcopy
```

simplify geojson with [simplify-geojson](https://github.com/maxogden/simplify-geojson)

```sh
npm install simplify-geojson geojsonio-cli csv2geojson -g
curl https://raw.github.com/maxogden/simplify-geojson/master/test-data/oakland-route.csv | \
  csv2geojson --lat "LATITUDE N/S" --lon "LONGITUDE E/W" --line true | \
  simplify-geojson -t 0.001 | \
  geojsonio
```
