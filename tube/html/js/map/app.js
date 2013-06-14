var lines = {};

var lat = 51.5171;
var lon = -0.1062;
var zoom = 11;
var map;
var layerStations;
var layerLines;
var projection = new OpenLayers.Projection('EPSG:4326');

function init() {
    initMap();
    initDiffusion();
}

function initMap() {
    map = new OpenLayers.Map('map', {
        controls : [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.LayerSwitcher()
        ],
        numZoomLevels : 19,
        units : 'm',
        projection : new OpenLayers.Projection('EPSG:900913'),
        displayProjection : projection
    });

    layerMapnik = new OpenLayers.Layer.OSM.Mapnik('Mapnik');
	layerMapnik.opacity = 0.6;
    map.addLayer(layerMapnik);

    layerStations = new OpenLayers.Layer.Markers('Stations');
    map.addLayer(layerStations);

    layerLines = new OpenLayers.Layer.Vector('Lines');
    map.addLayer(layerLines);

    var lonLat = new OpenLayers.LonLat(lon, lat).transform(projection, map.getProjectionObject());
    map.setCenter(lonLat, zoom);
}

function initDiffusion() {
    DiffusionClient.addTopicListener('^tube/line/.$', onLine);
    DiffusionClient.addTopicListener('^tube/line/./stations$', onStations);

    DiffusionClient.connect({
        onCallbackFunction : onConnect,
        onDataFunction : onData
    });
}

function onConnect(connected) {
    // Get list of lines
    DiffusionClient.fetch('tube/line/.');
}

function onData(msg) {
    console.log('Got data', msg);
}

function onLine(msg) {
    console.log('Got line', msg);
    var fields = msg.getRecords()[0];
    var id = fields.getField(0);

    lines[id] = {
        'name' : fields.getField(1),
        'color' : fields.getField(2)
    };

    DiffusionClient.fetch('tube/line/' + id + '/stations');
}

function onStations(msg) {
    console.log('Draw stations', msg);

    var lineId = msg.getTopic().split('/')[2];
    var line = lines[lineId];

    var stations = {};
    for(var i in msg.getRecords()) {
        var fields = msg.getRecord(i);

        var station = {};
        station['id'] = fields.getField(0);
        station['name'] = fields.getField(1);
        station['addr'] = fields.getField(2);
        station['lat'] = fields.getField(3);
        station['lon'] = fields.getField(4);
        station['prev'] = fields.getField(5);
        station['next'] = fields.getField(6);

        stations[station['id']] = station;
    }

    var icon = new OpenLayers.Icon('img/station.png',
                                   new OpenLayers.Size(20,20),
                                   new OpenLayers.Pixel(-10,-10));

    for(var i in stations) {
        var station = stations[i];

        var lonlat = new OpenLayers.LonLat(station['lon'], station['lat']).transform(projection, map.getProjectionObject());
        var marker = new OpenLayers.Marker(lonlat, icon.clone());

        layerStations.addMarker(marker);

        var prev = station['prev'];
        if(prev !== undefined && prev !== null) {

            var prevArr = prev.split(',');
            
            for(var p in prevArr) {
                var prevStn = stations[prevArr[p]];
                if(prevStn !== undefined && prevStn !== null) {
                    var start = new OpenLayers.Geometry.Point(prevStn['lon'], prevStn['lat']).transform(projection, map.getProjectionObject());
                    var end = new OpenLayers.Geometry.Point(station['lon'], station['lat']).transform(projection, map.getProjectionObject());

                    var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([start, end]),
                                                                {'name': line['name']},
                                                                {'stroke': true, 'strokeColor': line['color'], 'strokeWidth': 4});
                    layerLines.addFeatures(feature);
                }
            }
        }
    }

}

