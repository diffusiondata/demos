Train = function(record, existing) {
    var id;
    var lineId;
    var destStn;
    var fromStn;
    var toStn;
    var timeFromLastStn;
    var timeToNextStn;
    var feature;

    if(existing !== undefined) {
        this.id = existing.id;
        this.lineId = existing.lineId;
        this.destStn = existing.destStn;
        this.fromStn = existing.fromStn;
        this.toStn = existing.toStn;
        this.timeFromLastStn = existing.timeFromLastStn;
        this.timeToNextStn = existing.timeToNextStn;
        this.feature = existing.feature;
    }

    if(record !== undefined) {
        this.parseRecord(record);
    }
};

Train.prototype.parseRecord = function(record, existing) {
    var fields = record.getFields();

    if(fields[0] !== '') {
        this.id = fields[0];
    }
    if(fields[1] !== '') {
        this.destStn = fields[1];
    }
    if(fields[2] !== '') {
        this.fromStn = fields[2];
    }
    if(fields[3] !== '') {
        this.toStn = fields[3];
    }
    if(fields[4] !== '') {
        this.timeFromLastStn = parseInt(fields[4]);
    }
    if(fields[5] !== '') {
        this.timeToNextStn = parseInt(fields[5]);
    }
};

Train.prototype.calculatePosition = function() {
    if(this.fromStn === undefined || this.toStn === undefined) {
        return;
    }

    if(this.timeFromLastStn === undefined) {
        this.timeFromLastStn = 0
    }
    if(this.timeToNextStn === undefined) {
        this.timeToNextStn = 0;
    }

    var ratio = this.timeToNextStn / (this.timeFromLastStn + this.timeFromNextStn);

    var fromStn = stations[this.fromStn];
    var toStn = stations[this.toStn];

    var point;
    if(this.timetoNextStn <= 0) {
        // The train in the destination station
        point = new OpenLayers.Geometry.Point(toStn.lon, toStn.lat).transform(projection, map.getProjectionObject());
        this.dxPerSecond = 0;
        this.dyPerSecond = 0;
        this.arrivalTime = null;
    }
    else if(this.timeFromLastStn <= 0) {
        // The train is in the departure station
        point = new OpenLayers.Geometry.Point(fromStn.lon, fromStn.lat).transform(projection, map.getProjectionObject());
        this.dxPerSecond = 0;
        this.dyPerSecond = 0;
        this.arrivalTime = null;
    }
    else {
        // Between stations
        var ratioTravelled = this.timeFromLastStn / (this.timeFromLastStn + this.timeToNextStn);

        var lon = ((toStn.lon - fromStn.lon) * ratioTravelled) + fromStn.lon;
        var lat = ((toStn.lat - fromStn.lat) * ratioTravelled) + fromStn.lat;

        point = new OpenLayers.Geometry.Point(lon, lat).transform(projection, map.getProjectionObject());

        this.dxPerSecond = (toStn.feature.geometry.x - point.x) / this.timeToNextStn;
        this.dyPerSecond = (toStn.feature.geometry.y - point.y) / this.timeToNextStn;

        this.arrivalTime = new Date().getTime() + (this.timeToNextStn * 1000);
    }

    this.feature.geometry = point;
};
