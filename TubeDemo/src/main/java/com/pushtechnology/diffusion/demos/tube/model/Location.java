/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.pushtechnology.diffusion.demos.tube.Utils;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Train;

public class Location {

    public static enum Code {
        UNKNOWN,
        AT_PLATFORM,
        LEAVING,
        LEFT_STATION,
        BETWEEN_STATIONS,
        APPROACHING_STATION,
        AT_DESTINATION
    }

    private Code code;
    private Date date;
    private String line;
    private String from;
    private String to;
    private int secondsToNextStation;

    private final SimpleDateFormat mmss = new SimpleDateFormat("mm:ss");
    private final Pattern patternLeaving = Pattern.compile("^Leaving (.*)$");
    private final Pattern patternLeft = Pattern.compile("^Left (.*)$");
    private final Pattern patternBetween = Pattern.compile("^Between (.*) and (.*)$");
    private final Pattern patternAt = Pattern.compile("^At (.*)$");
    private final Pattern patternApproaching = Pattern.compile("^Approaching (.*)$");
    
    public Location(Code code, Date date, String line, String from, String to) {
        this.code = code;
        this.date = date;
        this.line = line;
        this.from = from;
        this.to = to;
        this.secondsToNextStation = -1;
    }

    /*
     * Constructor which parses a location from a train object returned from a summary.
     */
    public Location(final Train train, final String lineCode, final String stationCode, final Date date) {
        this.code = Code.UNKNOWN;
        this.line = lineCode;
        this.from = null;
        this.to = stationCode;
        this.date = date;
        
        final String locationStr = train.getL().trim();
        
        if (locationStr.startsWith("Leaving ")) {
            this.code = Code.LEAVING;
            Matcher m = patternLeaving.matcher(locationStr);
            if(m.find()) {
                this.from = Utils.stationNameToCode(lineCode, m.group(1).trim());
            }
        }
        if (locationStr.startsWith("Left ")) {
            this.code = Code.LEFT_STATION;
            Matcher m = patternLeft.matcher(locationStr);
            if(m.find()) {
                this.from = Utils.stationNameToCode(lineCode, m.group(1).trim());
            }
        }
        if (locationStr.startsWith("Between ")) {
            this.code = Code.BETWEEN_STATIONS;
            Matcher m = patternBetween.matcher(locationStr);
            if(m.find()) {
                this.from = Utils.stationNameToCode(lineCode, m.group(1).trim());
                this.to = Utils.stationNameToCode(lineCode, m.group(2).trim());
            }
        }
        if (locationStr.startsWith("Approaching ")) {
            this.code = Code.APPROACHING_STATION;
            Matcher m = patternApproaching.matcher(locationStr);
            if(m.find()) {
                this.to = Utils.stationNameToCode(lineCode, m.group(1).trim());
            }
        }
        if (locationStr.startsWith("At ")) {
            Matcher m = patternAt.matcher(locationStr);
            if (m.find()) {
                if (m.group(1).trim().equals("Platform")) {
                    this.code = Code.AT_PLATFORM;
                    this.from = stationCode;
                    this.to = stationCode;
                }
                else {
                    this.code = Code.AT_DESTINATION;
                    this.to = Utils.stationNameToCode(lineCode, m.group(1).trim());
                }
            }
        }
        
        try {
            final Date dd = mmss.parse(train.getC());
            Calendar cc = Calendar.getInstance();
            cc.setTime(dd);
            this.secondsToNextStation = cc.get(Calendar.MINUTE) * 60 + cc.get(Calendar.SECOND);
            
            // Because our feed could be 30s out...
            this.secondsToNextStation -= 15;
            if (this.secondsToNextStation < 0) {
                this.secondsToNextStation = 0;
            }
        }
        catch (ParseException ex) {
            if (this.code == Code.AT_PLATFORM) {
                this.secondsToNextStation = 0; // Probably got a "-" indicating in the station
            }
            else {
                this.secondsToNextStation = -1;
            }
        }
        
    }

    public Code getCode() {
        return code;
    }

    public Date getDate() {
        return date;
    }

    public String getLine() {
        return line;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }

    public int getSecondsToNextStation() {
        return secondsToNextStation;
    }

    @Override
    public String toString() {
        return "Location=" + code + "," + date + "," + line + "," + from + "," + to + "," + secondsToNextStation;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if(!(obj instanceof Location)) {
            return false;
        }
        final Location other = (Location)obj;
        if (this.code == other.code &&
            this.date == other.date &&
            this.line == other.line &&
            this.from == other.from &&
            this.to == other.to &&
            this.secondsToNextStation == other.secondsToNextStation) {
                return true;
        }
        return false;
    }
    
    
}
