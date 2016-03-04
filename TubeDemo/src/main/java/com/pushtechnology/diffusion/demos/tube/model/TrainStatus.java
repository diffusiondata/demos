/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube.model;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class TrainStatus {

    private String id;
    private String line;
    private String destination;
    private String lastStation;
    private String nextStation;
    private int secondsFromLastStation;
    private int secondsToNextStation;

    private LinkedList<Location> locationHistory;

    public TrainStatus(final String id,
            final String line, final String destination,
            final String lastStation, final String nextStation,
            final int secondsToNextStation) {
        this.id = id;
        this.line = line;
        this.destination = destination != null ? destination : "UNK";
        this.lastStation = lastStation != null ? lastStation : "UNK";
        this.nextStation = nextStation != null ? nextStation : "UNK";
        this.secondsFromLastStation = -1; // We need to work this out from Location history
        this.secondsToNextStation = secondsToNextStation;
        this.locationHistory = new LinkedList<Location>();

       if (this.lastStation == this.nextStation) {
            this.secondsFromLastStation = 0;
            this.secondsToNextStation = 0;
        }
    }

    public String getId() {
        return id;
    }

    public String getLine() {
        return line;
    }

    public String getDestination() {
        return destination;
    }

    public String getLastStation() {
        return lastStation;
    }

    public String getNextStation() {
        return nextStation;
    }

    public int getSecondsFromLastStation() {
        return secondsFromLastStation;
    }

    public int getSecondsToNextStation() {
        return secondsToNextStation;
    }

    public List<Location> getLocationHistory() {
        return locationHistory;
    }

    public synchronized void updateLocation(final Location location) {
        Location last = null;

        if (locationHistory.size() > 0) {
            last = locationHistory.getLast();
        }

        if (last != null) {
            if(last.equals(location)) {
                return; // Nothing to update
            }
        }

        if (location.getFrom() != null) {
            this.lastStation = location.getFrom();
        }
        if (location.getTo() != null) {
            this.nextStation = location.getTo();
        }

        // Step backwards through the history to find a different "to" station
        // for this train.
        final Iterator<Location> historyIter = this.locationHistory.descendingIterator();

        while (historyIter.hasNext()) {
            final Location history = historyIter.next();
            if (history.getTo() != location.getTo()) {
                this.secondsFromLastStation = (int)(location.getDate().getTime() - history.getDate().getTime()) / 1000;
                
                // We don't need any station history before this location.
                final int idx = locationHistory.indexOf(history);
                locationHistory.subList(0, idx).clear();
                
                break;
            }
        }

        // If we don't have a time for seconds from the last station (e.g. we didn't find
        // the previous station, then we default the to how long since the first location
        // in our history.
        if (this.secondsFromLastStation == -1 && this.locationHistory.size() > 0) {
            this.secondsFromLastStation = (int)(location.getDate().getTime() - this.locationHistory.getFirst().getDate().getTime()) / 1000;
        }

        this.secondsToNextStation = location.getSecondsToNextStation();

        // A little bit of sanitisation.
        if (this.secondsFromLastStation < -1) {
            this.secondsFromLastStation = -1;
        }
        if (this.secondsToNextStation < -1) {
            this.secondsToNextStation = -1;
        }
        if (this.lastStation.equals(this.nextStation)) {
            this.secondsFromLastStation = 0;
            this.secondsToNextStation = 0;
        }

        this.locationHistory.add(location);
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (this instanceof TrainStatus) {
            final TrainStatus other = (TrainStatus)obj;
            if (this.id == other.id &&
                    this.line == other.line &&
                    this.destination == other.destination &&
                    this.nextStation == other.nextStation &&
                    this.lastStation == other.lastStation &&
                    this.secondsFromLastStation == other.secondsFromLastStation &&
                    this.secondsToNextStation == other.secondsToNextStation &&
                    this.locationHistory == other.locationHistory) {
                return true;
            }
        }
        return false;
    }

}
