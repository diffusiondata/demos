package com.pushtechnology.diffusion.demos.tube.model;

import java.util.HashSet;
import java.util.Set;

public class Station {

    private final String code;
    private final String name;
    private final String description;
    private final double lat;
    private final double lon;
    private final Set<String> lineCodes;

    public Station(final String code, final String name, final String description,
            final double lat, final double lon,
            final Set<String> lineCodes) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.lat = lat;
        this.lon = lon;
        this.lineCodes = lineCodes;
    }

    public Station(final String code, final String name, final String description,
            final double lat, final double lon) {
        this(code, name, description, lat, lon, new HashSet<String>());
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }

    public Set<String> getLineCodes() {
        return lineCodes;
    }    
}
