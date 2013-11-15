package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.StreamSender;
import com.bea.wlevs.ede.api.StreamSource;

public class HeatAdapter implements StreamSource, HeatEventListener {

    private StreamSender eventSender;

    @Override
    public void setEventSender(StreamSender eventSender) {
        this.eventSender = eventSender;
    }

    @Override
    public void heatEvent(int sensorId, double value) {
        HeatEvent event = new HeatEvent();
        event.setSensorId(sensorId);
        event.setTemperature(value);
        System.out.println("HeatAdapter Sending Event : " + event);
        eventSender.sendInsertEvent(event);
    }

    public void setDiffusionConnection(DiffusionConnection diffusionConnection) {
        diffusionConnection.addHeatEventListener("Temp", this);
    }

}
