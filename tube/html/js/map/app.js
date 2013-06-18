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
//    console.log('layer changed: ', event);

    if(event.layer.options['type'] !== undefined && event.layer.options['type'] == 'line') {
        if(event.property === 'visibility') {
            if(event.layer.getVisibility() === true) {
//                console.log('Subscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
                DiffusionClient.subscribe('tube/line/' + event.layer.options['lineId'] + '/train/');
            }
            else {
//                console.log('Unsubscribe to updates for ' + event.layer.options['lineId'] + ' => ' + event.layer.name);
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

    var line = new Line(msg.getRecord(0));
    lines[line.id] = line;

    DiffusionClient.fetch('tube/line/' + line.id + '/stations');
}

function onStations(msg) {
//    console.log('Draw stations', msg);

    var lineId = msg.getTopic().split('/')[2];
    var line = lines[lineId];

    if(line === undefined || line === null) {
        return; // Don't know anything about this line
    }

    for(var i in msg.getRecords()) {
        var stn = new Station(msg.getRecord(i), lineId);
        line.stations[stn.id] = stn;
        stations[stn.id] = stn;
    }

    // var icon = new OpenLayers.Icon('img/station.png',
    //                                new OpenLayers.Size(20,20),
    //                                new OpenLayers.Pixel(-10,-10));

    // Draw line and stations
    for(var i in line.stations) {
        var station = line.stations[i];

        var lonlat = new OpenLayers.LonLat(station.lon, station.lat).transform(projection, map.getProjectionObject());

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
        var prev = station.prevStn;
        if(prev !== undefined && prev !== null) {

            var prevArr = prev.split(',');
            
            for(var p in prevArr) {
                var prevStn = line.stations[prevArr[p]];
                if(prevStn !== undefined && prevStn !== null) {
                    var start = new OpenLayers.Geometry.Point(prevStn.lon, prevStn.lat).transform(projection, map.getProjectionObject());
                    var end = new OpenLayers.Geometry.Point(station.lon, station.lat).transform(projection, map.getProjectionObject());

                    var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([start, end]),
                                                                {'name': line.name},
                                                                {'stroke': true, 'strokeColor': line.color, 'strokeWidth': 4});
                    layerLines[lineId].addFeatures(feature);
                }
            }
        }



        // Draw station
        layerLines[lineId].addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat),
                                                                      {},
                                                                      {
                                                                          'externalGraphic' : 'img/tube_sign_small.png',
                                                                          'graphicWidth'    : 20,
                                                                          'graphicHeight'   : 16
                                                                      }
                                                                     )]);

    }

}

function onTrain(msg) {
//    console.log('onTrain()', msg);

    var path = msg.getTopic().split('/');
    var lineId = path[2];
    var trainId = path[4];

    var train = new Train(msg.getRecord(0), trains[trainId]);

    trains[trainId] = train;

    var stnFrom = lines[lineId].stations[train.fromStn];
    var stnTo = lines[lineId].stations[train.toStn];

    if(stnFrom === undefined || stnTo === undefined) {
        return;
    }

//    console.log('Train ' + train.id + ' is between ' + stnFrom.id + ' and ' + stnTo.id);

    var ptFrom = new OpenLayers.Geometry.Point(stnFrom.lon, stnFrom.lat).transform(projection, map.getProjectionObject());
    var ptTo = new OpenLayers.Geometry.Point(stnTo.lon, stnTo.lat).transform(projection, map.getProjectionObject());

    if(train.feature === undefined) {
        var feature = new OpenLayers.Feature.Vector(ptFrom,
                                                    {
                                                        id : 'train_' + trainId
                                                    },
                                                    {
                                                        'externalGraphic' : 'img/train_small.png',
                                                        'graphicWidth'    : 24,
                                                        'graphicHeight'    : 24
                                                    }
                                                   );

        train.feature = feature;
//        console.log('Adding new feature ' + feature.id);
        layerLines[lineId].addFeatures([feature]);
    }
    else {
//        console.log('Train ' + train.id + ' already has feature ' + train.feature.id);
    }

    layerLines[lineId].removeFeatures([train.feature]);
    train.calculatePosition();
    layerLines[lineId].addFeatures([train.feature]);
}
