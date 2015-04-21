/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube.model;

import java.util.HashSet;
import java.util.Set;

public class Line {

    final private String code;
    final private String name;
    final private String colour;
    final private Set<String> stationCodes;

    public Line(final String code, final String name, final String colour,
            Set<String> stationCodes) {
        this.code = code;
        this.name = name;
        this.colour = colour;
        this.stationCodes = stationCodes;
    }

    public Line(final String code, final String name, final String colour) {
        this(code, name, colour, new HashSet<String>());
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getColour() {
        return colour;
    }

    public Set<String> getStationCodes() {
        return stationCodes;
    }

}
