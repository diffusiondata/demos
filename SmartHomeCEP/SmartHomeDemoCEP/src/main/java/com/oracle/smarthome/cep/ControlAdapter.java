package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.EventRejectedException;
import com.bea.wlevs.ede.api.StreamSink;
import com.oracle.smarthome.cep.DiffusionConnection.Device;

public class ControlAdapter implements StreamSink {

    private DiffusionConnection diffusionConnection;

    public void setDiffusionConnection(DiffusionConnection diffusionConnection) {
        this.diffusionConnection = diffusionConnection;
    }

    @Override
    public void onInsertEvent(Object event) throws EventRejectedException {
        if (event instanceof HeatEvent) {
            System.out.println("ControlAdapter: " + event);
            diffusionConnection.sendControlMessage(Device.Heater, ((HeatEvent) event).getStatus());
        } else if (event instanceof LightEvent) {
            System.out.println("ControlAdapter = " + event);
            diffusionConnection.sendControlMessage(Device.Light, ((LightEvent) event).getStatus());
        }
    }

}
