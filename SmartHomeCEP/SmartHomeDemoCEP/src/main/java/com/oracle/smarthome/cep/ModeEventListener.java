package com.oracle.smarthome.cep;

public interface ModeEventListener {
    public void modeEvent(String mode, Double ttl, Double tth, Double tte, Integer tl);
}
