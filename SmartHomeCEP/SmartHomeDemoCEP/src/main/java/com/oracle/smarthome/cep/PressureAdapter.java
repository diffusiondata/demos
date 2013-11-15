package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.StreamSender;
import com.bea.wlevs.ede.api.StreamSource;

public class PressureAdapter implements StreamSource, PressureEventListener {

    private StreamSender eventSender;

    @Override
    public void setEventSender(StreamSender eventSender) {
        this.eventSender = eventSender;
    }

    @Override
    public void pressureEvent(int sensorId, double value) {
        PressureEvent event = new PressureEvent();
        event.setSensorId(sensorId);
        event.setpressure(value);
        System.out.println("PressureAdapter Sending Event : " + event);
        eventSender.sendInsertEvent(event);
    }

    public void setDiffusionConnection(DiffusionConnection diffusionConnection) {
        diffusionConnection.addPressureEventListener("Temp", this);
    }

}
