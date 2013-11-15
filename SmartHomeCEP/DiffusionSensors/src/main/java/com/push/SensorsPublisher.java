package com.push;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.message.TopicMessage;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.Publisher;
import com.pushtechnology.diffusion.api.topic.Topic;

public class SensorsPublisher extends Publisher {

    private static final Logger LOG = LoggerFactory.getLogger(SensorsPublisher.class);

    public static final String SENSORS_TOPIC = "Sensors";
    public static final String READINGS_TOPIC = "Readings";
    public static final String CONTROL_TOPIC = "Control";
    public static final String TEMP_TOPIC = "Temp";
    public static final String LIGHT_TOPIC = "Light";
    public static final String PRESSURE_TOPIC = "Pressure";

    private Topic readingsTopic;
    private Topic controlTopic;

    private Topic sensorsTopic;

    @Override
    protected void initialLoad() throws APIException {
        super.initialLoad();

        sensorsTopic = addTopic(SENSORS_TOPIC);
        controlTopic = sensorsTopic.addTopic(CONTROL_TOPIC);
        controlTopic.addTopic("Heater");
        controlTopic.addTopic("Light");

        readingsTopic = sensorsTopic.addTopic(READINGS_TOPIC);
        readingsTopic.addTopic(TEMP_TOPIC);
        readingsTopic.addTopic(LIGHT_TOPIC);
        readingsTopic.addTopic(PRESSURE_TOPIC);
    }

    protected boolean isStoppable() {
        return true;
    }

    @Override
    protected void messageFromClient(TopicMessage message, Client client) {
        try {
            Topic topic = getTopic(message.getTopicName());
            topic.publishMessage(message);
        } catch (APIException e) {
            e.printStackTrace();
        }
    }
}
