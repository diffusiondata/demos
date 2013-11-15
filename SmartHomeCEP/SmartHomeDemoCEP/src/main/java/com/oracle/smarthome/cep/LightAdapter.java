package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.StreamSender;
import com.bea.wlevs.ede.api.StreamSource;

public class LightAdapter implements StreamSource, LightEventListener {

    private StreamSender eventSender;

    @Override
    public void setEventSender(StreamSender eventSender) {
        this.eventSender = eventSender;
    }

    @Override
    public void lightEvent(int sensorId, int value) {
        LightEvent event = new LightEvent();
        event.setSensorId(sensorId);
        event.setIntensity(value);
        System.out.println("LightAdapter Sending Event : " + event);
        eventSender.sendInsertEvent(event);
    }

    public void setDiffusionConnection(DiffusionConnection diffusionConnection) {
        diffusionConnection.addLightEventListener("Temp", this);
    }

}
