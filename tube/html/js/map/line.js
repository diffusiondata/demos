Line = function(record) {
    var id;
    var name;
    var color;
    var stations;

    if(record !== undefined) {
	this.parseRecord(record);
    }

    this.stations = {};
};

Line.prototype.parseRecord = function(record) {
    var fields = record.getFields();

    if(fields[0] !== '') {
	this.id = fields[0];
    }
    if(fields[1] !== '') {
	this.name = fields[1];
    }
    if(fields[2] !== '') {
	this.color = fields[2];
    }
};
