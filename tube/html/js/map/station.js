Station = function(record, lineId) {
    var id;
    var lineId;
    var name;
    var addr;
    var lat;
    var lon;
    var prevStn;
    var nextStn;

    if(record !== undefined) {
        this.parseRecord(record);
    }

    if(lineId !== undefined) {
        this.lineId = lineId;
    }
};

Station.prototype.parseRecord = function(record) {
    var fields = record.getFields();

    if(fields[0] !== '') {
        this.id = fields[0];
    }
    if(fields[1] !== '') {
        this.name = fields[1];
    }
    if(fields[2] !== '') {
        this.addr = fields[2];
    }
    if(fields[3] !== '') {
        this.lat = fields[3];
    }
    if(fields[4] !== '') {
        this.lon = fields[4];
    }
    if(fields[5] !== '') {
        this.prevStn = fields[5];
    }
    if(fields[6] !== '') {
        this.nextStn = fields[6];
    }
};
