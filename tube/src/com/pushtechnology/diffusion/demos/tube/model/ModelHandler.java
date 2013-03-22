package com.pushtechnology.diffusion.demos.tube.model;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;

import com.pushtechnology.diffusion.api.data.metadata.MRecord;
import com.pushtechnology.diffusion.api.message.MessageException;
import com.pushtechnology.diffusion.api.message.Record;
import com.pushtechnology.diffusion.demos.tube.xml.routes.Routes;
import com.pushtechnology.diffusion.demos.tube.xml.stations.Stations;

public enum ModelHandler {

    INSTANCE;

    private ConcurrentMap<String, Station> stationMap;
    private ConcurrentMap<String, Routing> routingMap;
    private ConcurrentMap<String, Line> lineMap;

    private ConcurrentMap<String, TrainStatus> trainStatusMap;

    private ModelHandler() {
        trainStatusMap = new ConcurrentHashMap<String, TrainStatus>();

        try {
            loadStations();
            loadRoutes();
            loadLines();
        }
        catch(Exception ex) {
            throw new IllegalArgumentException("Failed to initialise model", ex);
        }
    }

    private void loadStations() throws Exception {
        stationMap = new ConcurrentHashMap<String, Station>();

        JAXBContext ctx;

        ctx = JAXBContext.newInstance(Stations.class);
            SchemaFactory factory =
                SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema =
                factory.newSchema(new StreamSource(getClass().getClassLoader()
                    .getResourceAsStream("data/stations.xsd")));
            Unmarshaller unmarshaller = ctx.createUnmarshaller();
            unmarshaller.setSchema(schema);
            Stations stations =
                (Stations)unmarshaller.unmarshal(getClass().getClassLoader()
                    .getResourceAsStream("data/stations.xml"));

        for(com.pushtechnology.diffusion.demos.tube.xml.stations.Station stn : stations.getStation()) {
            Station model = new Station(stn.getCode(), stn.getName(), stn.getDescription(),stn.getCoords().getLat(), stn.getCoords().getLon());
            stationMap.put(model.getCode(), model);
        }
    }

    private void loadRoutes() throws Exception {
        routingMap = new ConcurrentHashMap<String, Routing>();

        JAXBContext ctx;

        ctx = JAXBContext.newInstance(Routes.class);
        SchemaFactory factory = SchemaFactory
                .newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
        Schema schema = factory.newSchema(new StreamSource(getClass()
                .getClassLoader().getResourceAsStream("data/routes.xsd")));
        Unmarshaller unmarshaller = ctx.createUnmarshaller();
        unmarshaller.setSchema(schema);

        Routes routes = (Routes) unmarshaller.unmarshal(getClass().getClassLoader().getResourceAsStream("data/routes.xml"));

        for(com.pushtechnology.diffusion.demos.tube.xml.routes.Line line : routes.getLine()) {
            for(com.pushtechnology.diffusion.demos.tube.xml.routes.Station stnRoute : line.getStation()) {
                Routing routing = new Routing(line.getId() + stnRoute.getId(),  stnRoute.getPrev(), stnRoute.getNext());
                routingMap.put(routing.getRoutingCode(), routing);
            }
        }
    }

    private void loadLines() {
        lineMap = new ConcurrentHashMap<String, Line>();

        for(String routingCode : routingMap.keySet()) {
            String lineCode = routingCode.substring(0, 1);
            String stationCode = routingCode.substring(1);

            Line line = lineMap.get(lineCode);

            if(line == null) {
                line = createLineDefn(lineCode);
                lineMap.put(lineCode, line);
            }

            line.getStationCodes().add(stationCode);
        }
    }

    private Line createLineDefn(final String lineCode) {
        switch(lineCode.charAt(0)) {
        case 'B':
            return new Line("B", "Bakerloo", "#996633");
        case 'C':
            return new Line("C", "Central", "#cc3333");
        case 'D':
            return new Line("D", "District", "#006633");
        case 'H':
            return new Line("H", "Hammersmith & Circle", "cc9999");
        case 'J':
            return new Line("J", "Jubilee", "#868f98");
        case 'M':
            return new Line("M", "Metropolitan", "#660066");
        case 'N':
            return new Line("N", "Northern", "#000000");
        case 'P':
            return new Line("P", "Piccadilly", "#000099");
        case 'V':
            return new Line("V", "Victoria", "#0099cc");
        case 'W':
            return new Line("W", "Waterloo & City", "#66cccc");
        default:
            return null;
        }
    }

    public Set<String> getLineCodes() {
        return lineMap.keySet();
    }

    public Set<String> getRoutingCodes() {
        return routingMap.keySet();
    }

    public Set<String> getStationCodes() {
        return stationMap.keySet();
    }

    public Set<String> getTrainIds() {
        return trainStatusMap.keySet();
    }

    public Set<Line> getLines() {
        return new HashSet<Line>(lineMap.values());
    }

    public Set<Routing> getRoutings() {
        return new HashSet<Routing>(routingMap.values());
    }

    public Set<Station> getStations() {
        return new HashSet<Station>(stationMap.values());
    }

    public Set<TrainStatus> getTrainStatuses() {
        return new HashSet<TrainStatus>(trainStatusMap.values());
    }

    public Station getStation(String stationCode) {
        return stationMap.get(stationCode);
    }

    public Line getLine(String lineCode) {
        return lineMap.get(lineCode);
    }

    public Routing getRouting(String routingCode) {
        return routingMap.get(routingCode);
    }

    public TrainStatus getTrainStatus(String trainId) {
        return trainStatusMap.get(trainId);
    }

    public void putTrainStatus(String id, TrainStatus status) {
        trainStatusMap.put(id,  status);
    }

    public void removeTrainStatus(String id) {
        trainStatusMap.remove(id);
    }

    public Record populateLineRecord(final MRecord metadata, final Line line) throws MessageException {
        Record record = new Record(metadata);

        record.setField("code", line.getCode());
        record.setField("name", line.getName());
        record.setField("colour", line.getColour());

        return record;
    }

    public Record populateStationRecord(final MRecord metadata, final Line line, final Station station) throws MessageException {
        Routing routing = null;

        if(line != null && station != null) {
            routing = getRouting(line.getCode() + station.getCode());
        }

        Record record = new Record(metadata);

        record.setField("code", station.getCode());
        record.setField("name", station.getName());
        record.setField("description", station.getDescription());
        record.setField("lat", station.getLat());
        record.setField("lon", station.getLon());
        if(routing != null) {
            record.setField("prev", routing.getPreviousStationsCSV());
            record.setField("next", routing.getNextStationsCSV());
        }

        return record;
    }

    public Record populateTrainRecord(final MRecord metadata, final TrainStatus train) throws MessageException {
        Record record = new Record(metadata);

        record.setField("id", train.getId());
        record.setField("destination", train.getDestination());
        record.setField("last", train.getLastStation());
        record.setField("next", train.getNextStation());
        record.setField("time_from_last", String.valueOf(train.getSecondsFromLastStation()));
        record.setField("time_to_next", String.valueOf(train.getSecondsToNextStation()));

           if(train.getId() == "004_6") {
                System.out.println(record);
            }

        return record;
    }
}
