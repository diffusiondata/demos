Train = function(record) {
    var id;
    var destStn;
    var fromStn;
    var toStn;
    var timeFromLastStn;
    var timeToNextStn;

    if(record !== undefined) {
        this.parseRecord(record);
    }
};

Train.prototype.parseRecord = function(record) {
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
        this.timeFrom = parseInt(fields[4]);
    }
    if(fields[5] !== '') {
        this.timeTo = parseInt(fields[5]);
    }
};