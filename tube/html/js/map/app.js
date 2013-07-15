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

var frameSkip = 0;
var isMovingTrains = false;
var updateInterval = 200;

var popup = null;

function init() {
    initMap();
    initDiffusion();

    setInterval(moveTrains, updateInterval);

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
    DiffusionClient.addTopicListener('^tube/line/[CJNWVP]$', onLine);
    DiffusionClient.addTopicListener('^tube/line/./stations$', onStations);
    DiffusionClient.addTopicListener('^tube/line/./train/.*$', onTrain);

    DiffusionClient.connect({
        onCallbackFunction : onConnect,
        onDataFunction : onData
    });
}

function onLayerChanged(event) {
    if(event.layer.options['type'] !== undefined && event.layer.options['type'] === 'line') {
        if(event.property === 'visibility') {
            if(event.layer.getVisibility() === true) {
                DiffusionClient.subscribe('tube/line/' + event.layer.options['lineId'] + '/train/');
            }
            else {
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
}

function onLine(msg) {
    var line = new Line(msg.getRecord(0));
    lines[line.id] = line;

    DiffusionClient.fetch('tube/line/' + line.id + '/stations');
}

function onStations(msg) {

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

    // Draw line and stations
    for(var i in line.stations) {
        var station = line.stations[i];

        var lonlat = new OpenLayers.LonLat(station.lon, station.lat).transform(projection, map.getProjectionObject());

        if(layerLines[lineId] === undefined) {
            layerLines[lineId] = new OpenLayers.Layer.Vector(line.name,
                                                             {
                                                                 'visibility' : false,
                                                                 'type'       : 'line',
                                                                 'lineId'     : lineId,
                                                                 'eventListeners' : {
                                                                     'featureselected' : function(evt) {
                                                                         showPopup(evt.feature);
                                                                     },
                                                                     'featureunselected' : function(evt) {
                                                                         hidePopup(evt.feature);
                                                                     }
                                                                 }
                                                             });
            var selector = new OpenLayers.Control.SelectFeature(layerLines[lineId], { hover: true, autoActivate: true });

            map.addLayer(layerLines[lineId]);
            map.addControl(selector);
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
                                                                      {
                                                                          'id' : 'stn_' + station.id
                                                                      },
                                                                      {
                                                                          'externalGraphic' : 'img/tube_sign_small.png',
                                                                          'graphicWidth'    : 20,
                                                                          'graphicHeight'   : 16
                                                                      }
                                                                     )]);

    }

}

function showPopup(feature) {

    if(popup !== undefined && popup !== null) {
        map.removePopup(popup);
        popup.destroy();
    }

    var id = feature.attributes.id;
    if(id !== undefined && id.indexOf('stn_') === 0) {
        var stnId = id.substring(4);
        var stn = stations[stnId];
        popup = new OpenLayers.Popup.FramedCloud('Station information',
                                                 OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                                 null,
                                                 '<div>' + stn.name + '</div>',
                                                 null, true, null);
        map.addPopup(popup);
    }        
    if(id !== undefined && id.indexOf('train_') === 0) {
        var trainId = id.substring(6);
        var train = trains[trainId];
        var stnFrom = stations[train.fromStn];
        var stnTo = stations[train.toStn];

        var desc = '<div><b>' + trainId + '</b></div>';
        desc += '<div>From ';
        if(stnFrom !== undefined) {
            desc += stnFrom.name + ' (' + stnFrom.id + ')';
        }
        else {
            desc += '???';
        }
        desc += ' to ';
        if(stnTo !== undefined) {
            desc += stnTo.name + ' (' + stnTo.id + ')';
        }
        else {
            desc += '???';
        }
        desc += '</div>';
        desc += '<div>From last=' + train.timeFromLastStn + ', to next=' + train.timeToNextStn + '</div>';

        desc += '<div>dx=' + train.dxPerSecond + ', dy=' + train.dyPerSecond + '</div>';

        popup = new OpenLayers.Popup.FramedCloud('Train information',
                                                 OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                                 null,
                                                 '<div>' + desc + '</div>',
                                                 null, true, null);
        map.addPopup(popup);
    }
}

function hidePopup(feature) {
    if(popup === undefined || popup === null) {
        return;
    }
    map.removePopup(popup);
    popup.destroy();
    popup = null;
}

function onTrain(msg) {
    var path = msg.getTopic().split('/');
    var lineId = path[2];
    var trainId = path[4];

    var train = new Train(msg.getRecord(0), trains[trainId]);

    // This train has arrived at it's destination, we can stop
    // tracking it now.
    if(train.fromStn === train.toStn === train.destStn) {
        if(trains.feature !== undefined) {
            layerLines[lineId].removeFeatures([train.feature]);
            layerLines[lineId].destroyFeatures([train.feature]);
        }
        trains[trainId] == undefined;
        return;
    }

    train.lineId = lineId;

    trains[trainId] = train;

    var stnFrom = lines[lineId].stations[train.fromStn];
    var stnTo = lines[lineId].stations[train.toStn];

    if(stnFrom === undefined || stnTo === undefined) {
        return;
    }

    var ptFrom = new OpenLayers.Geometry.Point(stnFrom.lon, stnFrom.lat).transform(projection, map.getProjectionObject());
    var ptTo = new OpenLayers.Geometry.Point(stnTo.lon, stnTo.lat).transform(projection, map.getProjectionObject());

    if(train.feature === undefined) {
        var feature = new OpenLayers.Feature.Vector(ptFrom,
                                                    {
                                                        id : 'train_' + trainId,
                                                    },
                                                    {
                                                        'externalGraphic' : 'img/train_small.png',
                                                        'graphicWidth'    : 24,
                                                        'graphicHeight'   : 24
                                                    }
                                                   );

        train.feature = feature;
        layerLines[lineId].addFeatures([feature]);
    }

    layerLines[lineId].removeFeatures([train.feature]);
    train.calculatePosition();
    layerLines[lineId].addFeatures([train.feature]);
}

function moveTrains() {
    if(isMovingTrains) {
        frameSkip++;
        return;
    }
    isMovingTrains = true;

    var now = new Date().getTime();
    var step = updateInterval / 1000;

    for(var i in trains) {
        var train = trains[i];

        if(train === undefined) {
            continue;
        }
        if(train.lineId === undefined || layerLines[train.lineId].getVisibility() === false) {
            continue;
        }

        // Train is past the station it's arriving at, stop moving.
        if(train.arrivalTime !== undefined && train.arrivalTime !== null &&
           train.arrivalTime <= now) {
            train.dxPerSecond = 0;
            train.dyPerSecond = 0;
        }
        
        if(train.dxPerSecond !== undefined && train.dyPerSecond !== undefined
          && train.dxPerSecond !== NaN && train.dyPerSecond !== NaN) {
            train.feature.geometry.move(
                train.dxPerSecond * step * (frameSkip + 1),
                train.dyPerSecond * step * (frameSkip + 1));
            layerLines[train.lineId].drawFeature(train.feature);
        }

    }

    frameSkip = 0;
    isMovingTrains = false;
}
