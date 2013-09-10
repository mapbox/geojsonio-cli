# geojsonio-cli

Shoot files from your shell to [geojson.io](http://geojson.io/) for lightning-fast
visualization and editing. This is a [node.js](http://nodejs.org) module and thus requires
node.

Read or pipe a file

    geojsonio map.geojson
    cat map.geojson | geojsonio

Options:

    --print prints the url rather than opening it
    --domain="http://custominstancedomain.com/"

### installation

    npm install -g geojsonio-cli
