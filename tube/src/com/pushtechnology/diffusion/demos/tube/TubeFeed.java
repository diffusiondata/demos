/* COPYRIGHT (c) 2013 Push Technology Ltd. */
package com.pushtechnology.diffusion.demos.tube;

import java.util.HashMap;
import java.util.Map;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.Logs;
import com.pushtechnology.diffusion.api.data.TopicDataFactory;
import com.pushtechnology.diffusion.api.data.metadata.MMessage;
import com.pushtechnology.diffusion.api.data.record.RecordTopicData;
import com.pushtechnology.diffusion.api.message.MessageException;
import com.pushtechnology.diffusion.api.message.Record;
import com.pushtechnology.diffusion.api.topic.Topic;
import com.pushtechnology.diffusion.demos.tube.meta.TubeMetadataFactories;
import com.pushtechnology.diffusion.demos.tube.model.Location;
import com.pushtechnology.diffusion.demos.tube.model.ModelHandler;
import com.pushtechnology.diffusion.demos.tube.model.TrainStatus;
import com.pushtechnology.diffusion.demos.tube.services.PredictionSummary;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Platform;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Station;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Summary;
import com.pushtechnology.diffusion.demos.tube.xml.prediction.summary.Train;

/**
 * An instance of this class runs in the background and is responsible for
 * receiving data from the TFL services and parsing it into the topic tree.
 */
public class TubeFeed implements Runnable {

    private TubePublisher publisher;

    public TubeFeed(TubePublisher publisher) {
        this.publisher = publisher;
    }

    @Override
    public void run() {
        Logs.finest("Fetching data from TFL...");

        // Ideally we'd do these in parallel.
        update("C");
        update("W");
        update("J");
        update("N");
        update("P");
        update("V");
        update("M");
    }

    /**
     * update
     * <p>
     * For the supplied line code, get the appropriate information from
     * TFL and parse it into the topic tree.
     */
    private void update(final String lineCode) {
        Summary summary = null;

        try {
            summary = PredictionSummary.fetch(lineCode);
        }
        catch(APIException ex) {
            Logs.warning("Failed to fetch prediction summary", ex);
            return;
        }

        Logs.finest("Got data from TFL, now parsing...");

        // Figure out where all the trains are and how long until the next station.
        // TODO: Then update the topic data for the train status

        Map<String, Integer> trainTimeMap = new HashMap<String, Integer>();

        // For each station/platform/train combination we receive, update
        // our internal model.
        for(Station s : summary.getS()) {
            for(Platform p : s.getP()) {
                for(Train t : p.getT()) {
                    try {
                        // Discard special trains.
                        if(t.getS().equals("000")
                            || t.getDE().equals("Metropolitan Train")
                            || t.getDE().equals("Unknown")) {
                            continue;
                        }

                        String trainId = t.getS() + "_" + t.getT();

                        Location location = new Location(t, lineCode, s.getCode(), summary.getTime().getTimeStamp());

                        // If it's a train that we haven't seen before, add it to the map and continue.
                        TrainStatus status = ModelHandler.INSTANCE.getTrainStatus(trainId);

                        if(status == null) {
                            status = new TrainStatus(trainId,
                                lineCode,
                                Utils.stationNameToCode(lineCode, t.getDE()),
                                null,
                                null,
                                -1);

                            status.updateLocation(location);

                            trainTimeMap.put(trainId, status.getSecondsToNextStation());
                            ModelHandler.INSTANCE.putTrainStatus(trainId, status);
                            continue;
                        }

                        // If the train has reached its destination, then we should remove it
                        // and the associated topic.
                        if(location.getCode() == Location.Code.AT_PLATFORM &&
                            status.getDestination().equals(status.getNextStation())) {
                            Logs.finest("Removing train " + trainId);
                            trainTimeMap.remove(trainId);
                            ModelHandler.INSTANCE.removeTrainStatus(trainId);
                            publisher.removeTopic(TubePublisher.LINE_TOPIC_NAME + "/" + lineCode + "/train/" + trainId);
                            continue;
                        }

                        // The same train may appear multiple times in the feed, and we only
                        // want to keep the one with the smallest "C=" time as others will
                        // be approaching stations further out on the line.
                        Integer seconds = trainTimeMap.get(trainId);

                        if(seconds == null || seconds == -1 || location.getSecondsToNextStation() < seconds) {
                            trainTimeMap.put(trainId, location.getSecondsToNextStation());

                            // Update the location history for this train
                            status.updateLocation(location);
                        }
                    }
                    catch(Exception ex) {
                        // We're not expecting anything to go wrong, but if it does
                        // we also don't want everything to stop.
                        ex.printStackTrace();
                    }
                }
            }
        }

        Logs.finest("Data fetched and parsed");

        // For each train, update the topic data (or create if not present).
        MMessage trainMeta = null;
        try {
            trainMeta = TubeMetadataFactories.createTrainListMetadata();
        }
        catch(APIException ex) {
            Logs.warning("Failed to get train metadata", ex);
            return;
        }

        // Update the topic tree with data from our internal model
        for(TrainStatus status : ModelHandler.INSTANCE.getTrainStatuses()) {
            String topicName = TubePublisher.LINE_TOPIC_NAME + "/" + status.getLine() + "/train/" + status.getId();

            Topic trainTopic = publisher.getTopic(topicName);

            Record record = null;
            try {
                record = ModelHandler.INSTANCE.populateTrainRecord(trainMeta.getRecord("train"), status);
            }
            catch(MessageException ex) {
                Logs.warning("Failed to create a train record", ex);
                continue;
            }
            if(trainTopic == null) {
                try {
                    RecordTopicData trainData = TopicDataFactory.newRecordData(trainMeta);
                    trainData.initialise(record);
                    trainTopic = publisher.addTopic(topicName, trainData);
                }
                catch(APIException ex) {
                    Logs.warning("Failed to create a new train topic", ex);
                    continue;
                }
            }
            else {
                RecordTopicData trainData = (RecordTopicData)trainTopic.getData();
                try {
                    trainData.startUpdate();
                    trainData.update(record);
                    if(trainData.hasChanges()) {
                        trainData.publishMessage(trainData.generateDeltaMessage());
                    }
                }
                catch(APIException ex) {
                    Logs.warning("Failed to update a train record", ex);
                    trainData.abortUpdate();
                }
                finally {
                    trainData.endUpdate();
                }
            }
        }
    }

}
