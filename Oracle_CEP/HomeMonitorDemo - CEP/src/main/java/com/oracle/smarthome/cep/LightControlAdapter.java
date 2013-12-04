package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.EventRejectedException;
import com.bea.wlevs.ede.api.StreamSink;

public class LightControlAdapter implements StreamSink {

    private DiffusionAdapter diffusionAdapter;

    public LightControlAdapter() {
        diffusionAdapter = DiffusionAdapter.getInstance();
    }

    @Override
    public void onInsertEvent(Object event) throws EventRejectedException {
        diffusionAdapter.sendControlEvent((LightControlEvent) event);
    }

}
