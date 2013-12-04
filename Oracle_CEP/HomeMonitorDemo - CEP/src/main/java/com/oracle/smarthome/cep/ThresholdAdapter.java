package com.oracle.smarthome.cep;

import com.bea.wlevs.ede.api.StreamSender;
import com.bea.wlevs.ede.api.StreamSource;

public class ThresholdAdapter implements StreamSource {

    private StreamSender sender;

    public ThresholdAdapter() {
        DiffusionAdapter.getInstance().setThresholdAdapter(this);
    }

    @Override
    public void setEventSender(StreamSender sender) {
        this.sender = sender;
    }

    public void sendEvent(String mode, double ttl, double tth, int tl) {
        sender.sendInsertEvent(new ThresholdEvent(mode, ttl, tth, tl));
    }
}
