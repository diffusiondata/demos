/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube;

import com.pushtechnology.diffusion.demos.tube.model.ModelHandler;
import com.pushtechnology.diffusion.demos.tube.model.Station;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/*
 * Some general-purpose methods 
 */
public class Utils {

    private static final Logger LOG = LoggerFactory.getLogger(Utils.class);
    private static final String[] TRIM_PHRASES = new String[] { " via ", " Platform", " platform", " (", " ex ", " towards " };

    /**
     * findNearestStation
     * <p>
     * Given latitude and longitude coordinates, what is the nearest station?
     *
     * @param lat Latitude
     * @param lon Longitude
     * @return The nearest Station to the supplied coordinates.
     */
    public static Station findNearestStation(final double lat, final double lon) {
        Station nearestStation = null;
        double smallestDistance = Double.MAX_VALUE;

        for(Station station : ModelHandler.INSTANCE.getStations()) {
            double lat2 = station.getLat();
            double lon2 = station.getLon();

            double dLat = Math.toRadians(lat2 - lat);
            double dLon = Math.toRadians(lon2 - lon);
            double latR1 = Math.toRadians(lat);
            double latR2 = Math.toRadians(lat2);

            double a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(latR1) * Math.cos(latR2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            double d = 6371 * c; // km

            if(d < smallestDistance) {
                smallestDistance = d;
                nearestStation = station;
            }
        }

        return nearestStation;
    }

    /**
     * stationNametoCode
     * <p>
     * For a station "name", try to figure out the station code.
     * The name we receive isn't consistent, so apply some rules to
     * fix some of the more common ones.
     *
     * @param line The code for the line ("C", "J", etc)
     * @param name The full name of the station.
     * @return The station code
     */
    public static String stationNameToCode(final String line, final String name) {

        String searchName = name.trim();

        // Some destinations are "via" another station or have some other
        // extraneous information in the text.
        for(String phrase : TRIM_PHRASES) {
            int idx = searchName.indexOf(phrase);
            if(idx != -1) {
                searchName = searchName.substring(0, idx);
            }
        }

        searchName = searchName.trim();

        if(searchName.equals("King's Cross")) {
            searchName = "King's Cross St. Pancras";
        }

        if(searchName.equals("Euston Station")) {
            searchName = "Euston";
        }

        if(searchName.equals("Central Finchley")) {
            searchName = "Finchley Central";
        }
        if(searchName.equals("Central") && line.equals("N")) {
            searchName = "Finchley Central";
        }

        if(searchName.equals("St. John Wood")) {
            searchName = "St. John's Wood";
        }

        if(searchName.equals("Camden")) {
            searchName = "Camden Town";
        }

        if(searchName.equals("Brent Oak")) {
            searchName = "Burnt Oak";
        }

        if(searchName.startsWith("Kings Cross") || searchName.startsWith("King's Cross")) {
            searchName = "King's Cross St. Pancras";
        }

        if(searchName.startsWith("Highbury")) {
            searchName = "Highbury & Islington";
        }

        if(searchName.equals("Turnhams Green")) {
            searchName = "Turnham Green";
        }

        if(searchName.equals("Edgware Road")) {
            searchName = "Edgware";
        }

        for(Station stn : ModelHandler.INSTANCE.getStations()) {
            if(searchName.equalsIgnoreCase(stn.getName())) {
                return stn.getCode();
            }
        }

        LOG.debug("Didn't find station code for " + name + " ("+ searchName + ")");
        return null;
    }
}
