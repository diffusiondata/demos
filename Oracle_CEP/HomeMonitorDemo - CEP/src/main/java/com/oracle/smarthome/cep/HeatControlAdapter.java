package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.EventRejectedException;
import com.bea.wlevs.ede.api.StreamSink;

public class HeatControlAdapter implements StreamSink {

    private DiffusionAdapter diffusionAdapter;

    public HeatControlAdapter() {
        diffusionAdapter = DiffusionAdapter.getInstance();
    }

    @Override
    public void onInsertEvent(Object event) throws EventRejectedException {
        diffusionAdapter.sendControlEvent((HeatControlEvent) event);
    }

}
