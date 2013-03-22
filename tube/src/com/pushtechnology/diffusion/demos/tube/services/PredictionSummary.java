package com.pushtechnology.diffusion.demos.tube.services;

import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Summary;

public class PredictionSummary {

    private final static String baseUrl = "http://cloud.tfl.gov.uk/TrackerNet/PredictionSummary";

    public static Summary fetch(String lineCode) throws APIException {
        URL url = null;

        try {
            url = new URL(baseUrl + "/" + lineCode);
        }
        catch(MalformedURLException ex) {
            throw new APIException("Failed to build URL", ex);
        }

        Summary summary = null;

        try {
            URLConnection conn = url.openConnection();
            InputStream in = conn.getInputStream();

            JAXBContext ctx;
            ctx = JAXBContext.newInstance(Summary.class);
            SchemaFactory factory =
                SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema =
                factory.newSchema(new StreamSource(PredictionSummary.class.getClassLoader()
                    .getResourceAsStream("data/PredictionSummary.xsd")));
            Unmarshaller unmarshaller = ctx.createUnmarshaller();
            unmarshaller.setSchema(schema);

            summary = (Summary)unmarshaller.unmarshal(in);

            in.close();
        }
        catch (Exception ex) {
            throw new APIException("Error loading stations", ex);
        }

        return summary;
    }
}
