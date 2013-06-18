Train = function(record, existing) {
    var id;
    var destStn;
    var fromStn;
    var toStn;
    var timeFromLastStn;
    var timeToNextStn;
    var feature;

    if(existing !== undefined) {
        this.id = existing.id;
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
    if(this.timeFromLastStn <= 0 || this.timetoNextStn <= 0) {
        // The train in the destination station
        point = new OpenLayers.Geometry.Point(toStn.lon, toStn.lat).transform(projection, map.getProjectionObject());
    }
    else if(this.timeFromLastStn <= 0) {
        // The train is in the departure station
        point = new OpenLayers.Geometry.Point(fromStn.lon, fromStn.lat).transform(projection, map.getProjectionObject());
    }
    else {
        // Between stations
        var ratio = this.timeToNextStn / (this.timeFromLastStn + this.timeToNextStn);

        var dLon = ((toStn.lon - fromStn.lon) * ratio);
        var dLat = ((toStn.lat - fromStn.lat) * ratio);

        point = new OpenLayers.Geometry.Point(
            fromStn.lon + dLon,
            fromStn.lat + dLat).transform(projection, map.getProjectionObject());
    }

    this.feature.geometry = point;
};
        

/*    
        //Total Time
        var totalTime = new Number(this.secondsFrom + this.secondsTo);
        if(this.secondsTo<=0 || this.secondsFrom <= 0){
            // Don't move Train (It is in the destination Station)
            this.dLat = new Number(0);
            this.dLng = new Number(0);

            //Print at the Station
            this.actualLat = toStationCoords[0];
            this.actualLng = toStationCoords[1];

        }else if (this.secondsFrom <= 0){
            // Don't move Train (It is in the departure Station)
            this.dLat = new Number(0);
            this.dLng = new Number(0);

            //Print at the Station
            this.actualLat = fromStationCoords[0];
            this.actualLng = fromStationCoords[1];

        }else{
            console.log("totalTime", totalTime)

            //Delta Increase
            this.dLat = (toStationCoords[0] - fromStationCoords[0])/totalTime; //*0.5; 
            this.dLng = (toStationCoords[1] - fromStationCoords[1])/totalTime; //*0.5;
            console.log("Delta calculates", this.dLat,this.dLng)

            //Actual position
            console.log('this.dLat',this.dLat,'totalTime',totalTime,'secondsFrom',this.secondsFrom);

            this.actualLat = fromStationCoords[0] + ((this.dLat /totalTime) * this.secondsFrom);//*0.5;
            this.actualLng = fromStationCoords[1] + ((this.dLng /totalTime) * this.secondsFrom);//*0.5;
            console.log("REsult: actualLat:",this.actualLat, "actualLng:",this.actualLng);
        }
*/

