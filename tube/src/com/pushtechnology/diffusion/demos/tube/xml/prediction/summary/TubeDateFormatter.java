package com.pushtechnology.diffusion.demos.tube.xml.prediction.summary;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TubeDateFormatter {

    private static final SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    public static Date parse(String value) {
        Date date = null;

        try {
            date = format.parse(value);
        }
        catch(ParseException ex) {
            throw new IllegalArgumentException("Unable to parse date: " + value, ex);
        }

        return date;
    }

    public static String print(Date value) {
        return format.format(value);
    }

}
