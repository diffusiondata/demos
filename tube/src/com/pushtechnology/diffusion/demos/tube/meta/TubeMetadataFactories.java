package com.pushtechnology.diffusion.demos.tube.meta;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.TopicDataType;
import com.pushtechnology.diffusion.api.data.metadata.MDataType;
import com.pushtechnology.diffusion.api.data.metadata.MMessage;
import com.pushtechnology.diffusion.api.data.metadata.MRecord;
import com.pushtechnology.diffusion.api.data.metadata.MetadataFactory;
import com.pushtechnology.diffusion.api.data.metadata.Multiplicity;

/**
 * Factory methods for creating metadata associated with RecordTopicData.
 */
public class TubeMetadataFactories {

    private static MMessage lineMeta;
    private static MMessage stationListMeta;
    private static MMessage trainListMeta;

    public static MMessage createLineMetadata() throws APIException {
        if(lineMeta == null) {
            lineMeta = MetadataFactory.newMetadata("LineDefinition", TopicDataType.RECORD);

            MRecord lineRecord = lineMeta.addRecord("line", new Multiplicity(1));
            lineRecord.addField("code");
            lineRecord.addField("name");
            lineRecord.addField("colour");
        }

        return lineMeta;
    }

    public static MMessage createStationListMetadata() throws APIException {
        if(stationListMeta == null) {
            stationListMeta = MetadataFactory.newMetadata("StationList", TopicDataType.RECORD);

            MRecord stationRecord = stationListMeta.addRecord("station", new Multiplicity(0, -1));
            stationRecord.addField("code");
            stationRecord.addField("name");
            stationRecord.addField("description");
            stationRecord.addField("lat", MDataType.DECIMAL_STRING).setScale(15);
            stationRecord.addField("lon", MDataType.DECIMAL_STRING).setScale(15);
            stationRecord.addField("prev");
            stationRecord.addField("next");
        }

        return stationListMeta;
    }

    public static MMessage createTrainListMetadata() throws APIException {
        if(trainListMeta == null) {
            trainListMeta = MetadataFactory.newMetadata("TrainList", TopicDataType.RECORD);

            MRecord trainRecord = trainListMeta.addRecord("train", new Multiplicity(0, -1));
            trainRecord.addField("id");
            trainRecord.addField("destination");
            trainRecord.addField("last");
            trainRecord.addField("next");
            trainRecord.addField("time_from_last");
            trainRecord.addField("time_to_next");
        }

        return trainListMeta;
    }
}
