var lines = {};
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

    DiffusionClient.connect({
        onCallbackFunction : onConnect,
        onDataFunction : onData
    });
}

function onLayerChanged(event) {
    console.log('layer changed: ', event);
    xyzzy = event;
    if(event.layer.options['type'] !== undefined && event.layer.options['type'] == 'line') {
        if(event.property === 'visibility') {
            if(event.layer.getVisibility() === true) {
                console.log('Subscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
            }
            else {
                console.log('Unsubscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
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

    // var icon = new OpenLayers.Icon('img/station.png',
    //                                new OpenLayers.Size(20,20),
    //                                new OpenLayers.Pixel(-10,-10));

    // Draw line and stations
    for(var i in stations) {
        var station = stations[i];

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

