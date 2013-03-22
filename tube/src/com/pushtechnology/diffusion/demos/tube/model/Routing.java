package com.pushtechnology.diffusion.demos.tube.model;

import java.util.List;

public class Routing {

    private final String routingCode;
    private final List<String> previousStations;
    private final List<String> nextStations;

    private String previousStationsCSV;
    private String nextStationsCSV;

    public Routing(final String routingCode,
            final List<String> previousStations,
            final List<String> nextStations) {
        super();
        this.routingCode = routingCode;
        this.previousStations = previousStations;
        this.nextStations = nextStations;
    }

    public String getRoutingCode() {
        return routingCode;
    }

    public List<String> getPreviousStations() {
        return previousStations;
    }

    public List<String> getNextStations() {
        return nextStations;
    }

    public String getPreviousStationsCSV() {
        if(previousStationsCSV == null) {
            previousStationsCSV = listToCSV(previousStations);
        }
        return previousStationsCSV;
    }

    public String getNextStationsCSV() {
        if(nextStationsCSV == null) {
            nextStationsCSV = listToCSV(nextStations);
        }
        return nextStationsCSV;
    }

    private String listToCSV(final List<String> items) {
        StringBuilder b = new StringBuilder();
        for(String item : items) {
            b.append(item);
            b.append(',');
        }
        if(b.length() > 0) {
            return b.toString().substring(0, b.length()-1);
        }
        return "";
    }

}
