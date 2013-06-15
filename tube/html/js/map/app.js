var xyzzy = [];

var lines = {};
var trains = {};
var stations = {};
var defaultLine = 'C';
var initialising = true;

var lat = 51.5171;
var lon = -0.1062;
var zoom = 11;
var map;
var layerLines = {};
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
        displayProjection : projection,
        eventListeners : {
            'changelayer' : onLayerChanged
        }
    });

    layerMap = new OpenLayers.Layer.OSM.Mapnik('Map');
    layerMap.opacity = 0.6;
    map.addLayer(layerMap);

    var lonLat = new OpenLayers.LonLat(lon, lat).transform(projection, map.getProjectionObject());
    map.setCenter(lonLat, zoom);
}

function initDiffusion() {
    DiffusionClient.addTopicListener('^tube/line/.$', onLine);
    DiffusionClient.addTopicListener('^tube/line/./stations$', onStations);
    DiffusionClient.addTopicListener('^tube/line/./train/.*$', onTrain);

    DiffusionClient.connect({
        onCallbackFunction : onConnect,
        onDataFunction : onData
    });
}

function onLayerChanged(event) {
    console.log('layer changed: ', event);

    if(event.layer.options['type'] !== undefined && event.layer.options['type'] == 'line') {
        if(event.property === 'visibility') {
            if(event.layer.getVisibility() === true) {
                console.log('Subscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
                DiffusionClient.subscribe('tube/line/' + event.layer.options['lineId'] + '/train/');
            }
            else {
                console.log('Unsubscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
                DiffusionClient.unsubscribe('tube/line/' + event.layer.options['lineId'] + '/train/');
            }
        }
    }
}

function onConnect(connected) {
    // Get list of lines
    DiffusionClient.fetch('tube/line/.');
}

function onData(msg) {
//    console.log('Got data', msg);
}

function onLine(msg) {
//    console.log('Got line', msg);
    var fields = msg.getRecords()[0];
    var id = fields.getField(0);

    lines[id] = {
        'name' : fields.getField(1),
        'color' : fields.getField(2)
    };

    DiffusionClient.fetch('tube/line/' + id + '/stations');
}

function onStations(msg) {
//    console.log('Draw stations', msg);

    var lineId = msg.getTopic().split('/')[2];
    var line = lines[lineId];

    var stationsOnLine = [];
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
	stationsOnLine.push(station);
    }

    // var icon = new OpenLayers.Icon('img/station.png',
    //                                new OpenLayers.Size(20,20),
    //                                new OpenLayers.Pixel(-10,-10));

    // Draw line and stations
    for(var i in stationsOnLine) {
        var station = stationsOnLine[i];

        var lonlat = new OpenLayers.LonLat(station['lon'], station['lat']).transform(projection, map.getProjectionObject());

        if(layerLines[lineId] === undefined) {
            layerLines[lineId] = new OpenLayers.Layer.Vector(line.name,
                                                             {
                                                                 'visibility' : false,
                                                                 'type'       : 'line',
                                                                 'lineId'     : lineId
                                                             });
            map.addLayer(layerLines[lineId]);
        }
        if(initialising === true) {
            if(lineId === defaultLine) {
                layerLines[lineId].setVisibility(true);
            }
            initialising = false;
        }

        // Draw lines between stations
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
                    layerLines[lineId].addFeatures(feature);
                }
            }
        }

        // Draw station
        layerLines[lineId].addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
                                                                      {},
                                                                      {
                                                                          'externalGraphic' : 'img/station.png',
                                                                          'graphicWidth'    : 20,
                                                                          'graphicHeight'   : 20
                                                                      }
                                                                     )]);

    }

}

function onTrain(msg) {
//    console.log('onTrain()', msg);

    var path = msg.getTopic().split('/');
    var lineId = path[2];
    var trainId = path[4];

    var fields = msg.getRecord(0).getFields();
    var dest = fields[1];
    var from = fields[2];
    var to = fields[3];
    var timeFrom = fields[4];
    var timeTo = fields[5];

    if(trains[trainId] === undefined) {
        trains[trainId] = {};
    }

    mergeField(trains[trainId], 'dest', dest);
    mergeField(trains[trainId], 'from', from);
    mergeField(trains[trainId], 'to', to);
    mergeField(trains[trainId], 'timeFrom', timeFrom);
    mergeField(trains[trainId], 'timeTo', timeTo);
}

function mergeField(collection, key, value) {
    if(value !== '') {
        collection[key] = value;
    }
}
