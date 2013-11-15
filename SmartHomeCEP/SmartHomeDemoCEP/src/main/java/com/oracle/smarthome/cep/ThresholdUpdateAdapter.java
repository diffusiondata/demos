package com.oracle.smarthome.cep;

import java.util.Map;

import javax.servlet.http.HttpServlet;

import org.springframework.beans.factory.InitializingBean;

import com.bea.wlevs.ede.api.Adapter;
import com.bea.wlevs.ede.api.StreamSender;
import com.bea.wlevs.ede.api.StreamSource;

public class ThresholdUpdateAdapter extends HttpServlet implements Adapter, StreamSource, InitializingBean, ModeEventListener {

    private enum Action {
        lighton, lightoff, heateron, heateroff, unknown;
    }

    private StreamSender sender;
    private Map<Integer, ThresholdConfig> thresholdCache;
    private DiffusionConnection diffusionConnection;

    @Override
    public void setEventSender(StreamSender sender) {
        this.sender = sender;
    }

    public void setDiffusionConnection(DiffusionConnection diffusionConnection) {
        this.diffusionConnection = diffusionConnection;
    }

    public void setThresholdCache(Map thresholdCache) {
        this.thresholdCache = thresholdCache;
    }

    public Map getThresholdCache() {
        return thresholdCache;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        diffusionConnection.addModeEventListener(this);
    }

    @Override
    public void modeEvent(String mode, Double ttl, Double tth, Double tte, Integer tl) {
        System.out.printf("Update settings mode=%s ttl=%f tth=%f tte=%f tl=%d%n", mode, ttl, tth, tte, tl);
        ThresholdConfig config = thresholdCache.get(1);
        if (config == null) {
            config = new ThresholdConfig();
            thresholdCache.put(1, config);
        }

        if (mode != null) {
            config.setMode(mode);
        }
        if (ttl != null) {
            config.setTtl(ttl);
        }
        if (tth != null) {
            config.setTth(tth);
        }
        if (tte != null) {
            config.setTte(tte);
        }
        if (tl != null) {
            config.setTl(tl);
        }
    }
}
