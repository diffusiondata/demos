/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.TopicDataFactory;
import com.pushtechnology.diffusion.api.data.metadata.MMessage;
import com.pushtechnology.diffusion.api.data.metadata.MRecord;
import com.pushtechnology.diffusion.api.data.record.RecordTopicData;
import com.pushtechnology.diffusion.api.message.Record;
import com.pushtechnology.diffusion.api.message.TopicMessage;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.Publisher;
import com.pushtechnology.diffusion.api.topic.Topic;
import com.pushtechnology.diffusion.demos.tube.meta.TubeMetadataFactories;
import com.pushtechnology.diffusion.demos.tube.model.Line;
import com.pushtechnology.diffusion.demos.tube.model.ModelHandler;
import com.pushtechnology.diffusion.demos.tube.model.Station;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Main TubePublisher class
 */
public class TubePublisher extends Publisher {

    private static final Logger LOG = LoggerFactory.getLogger(TubePublisher.class);

    public static final String ROOT_TOPIC_NAME = "tube";
    public static final String STATION_TOPIC_NAME = ROOT_TOPIC_NAME + "/station";
    public static final String LINE_TOPIC_NAME = ROOT_TOPIC_NAME + "/line";

    /**
     * initialLoad
     * <p>
     * Set up the topics and static data used by the publisher.
     * 
     * @see com.pushtechnology.diffusion.api.publisher.Publisher#initialLoad()
     */
    @Override
    protected void initialLoad() throws APIException {
        addTopic(ROOT_TOPIC_NAME);
        addTopic(STATION_TOPIC_NAME + "/nearest");

        Topic lineRootTopic = addTopic(LINE_TOPIC_NAME, TopicDataFactory.newChildListData());

        MMessage lineMeta = TubeMetadataFactories.createLineMetadata();
        MMessage stationListMeta = TubeMetadataFactories.createStationListMetadata();

        // Add topics /tube/line/LINE_CODE              => line definition
        //            /tube/line/LINE_CODE/stations     => station list
        for(String lineCode : ModelHandler.INSTANCE.getLineCodes()) {

            RecordTopicData lineData = TopicDataFactory.newRecordData(lineMeta);
            RecordTopicData stationListData = TopicDataFactory.newRecordData(stationListMeta);

            List<Record> records = new ArrayList<Record>();

            Line line = ModelHandler.INSTANCE.getLine(lineCode);

            for(String stationCode : line.getStationCodes()) {
                Station station = ModelHandler.INSTANCE.getStation(stationCode);

                if(station == null) {
                    LOG.warn("Unable to find station " + stationCode);
                    continue;
                }

                Record stationRecord = ModelHandler.INSTANCE.populateStationRecord(stationListMeta.getRecord("station"), line, station);
                if(stationRecord != null) {
                    records.add(stationRecord);
                }
                else {
                    LOG.warn("Unable to find record for line "+ lineCode + ", station " + stationCode);
                }
            }

            stationListData.initialise(records.toArray(new Record[0]));

            lineData.initialise(ModelHandler.INSTANCE.populateLineRecord(lineMeta.getRecord("line"), line));

            Topic lineTopic = addTopic(line.getCode(), lineRootTopic, lineData);

            addTopic("stations", lineTopic, stationListData);
        }

        // Start up TFL scraper.
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(new TubeFeed(this), 1L, 10L, TimeUnit.SECONDS);
    }

    /**
     * subscription
     * <p>
     * When clients subscribe to train information topics, generate and send a TopicLoad message.
     *
     * @see com.pushtechnology.diffusion.api.publisher.Publisher#subscription(com.pushtechnology.diffusion.api.publisher.Client, com.pushtechnology.diffusion.api.topic.Topic, boolean)
     */
    @Override
    protected void subscription(final Client client, final Topic topic, final boolean loaded)
    throws APIException {
        if(topic.getName().matches("^" + LINE_TOPIC_NAME + "/./train/.*$")) {
            TopicMessage load = topic.getData().getLoadMessage();
            client.send(load);
        }
    }

    /**
     * fetchForClient
     * <p>
     * Fetch requests are typically for retrieving static data. In this case, we
     * are creating a service which will return the nearest station when a fetch
     * request is received for .../station/nearest, containing a header with a
     * latitude and longitude (separated with a comma). If this header isn't present,
     * we default to returning Oxford Circus which is fairly central.
     *
     * @see com.pushtechnology.diffusion.api.publisher.Publishers#fetch(com.pushtechnology.diffusion.api.publisher.Client, com.pushtechnology.diffusion.api.topic.Topic, List<String>)
     */
    @Override
    protected TopicMessage fetchForClient(final Client client, final Topic topic,
            final List<String> headers) throws APIException {
        TopicMessage reply = null;

        if(topic.getName().equals(ROOT_TOPIC_NAME + "/station/nearest")) {
            Station defaultStation = ModelHandler.INSTANCE.getStation("OXC");
            double lat = defaultStation.getLat();
            double lon = defaultStation.getLon();
            if(headers.size() > 0) {
                String[] coords = headers.get(0).split(",");
                if(coords.length > 0) {
                    lat = Double.valueOf(coords[0]);
                }
                if(coords.length > 1) {
                    lon = Double.valueOf(coords[1]);
                }
            }
            Station station = Utils.findNearestStation(lat, lon);

            MMessage stationListMeta = TubeMetadataFactories.createStationListMetadata();
            MRecord stationMeta = stationListMeta.getRecord("station");

            reply = topic.createLoadMessage();
            Record record = ModelHandler.INSTANCE.populateStationRecord(stationMeta, null, station);
            reply.putRecords(record);
        }

        return reply;
    }

    /**
     * isStoppable
     * <p>
     * This must return true for hot (re-)deployment to work.
     *
     * @see com.pushtechnology.diffusion.api.publisher.Publisher#isStoppable()
     */
    @Override
    protected boolean isStoppable() {
        return true;
    }

}
