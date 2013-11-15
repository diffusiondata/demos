package com.oracle.smarthome.cep;

public interface HeatEventListener {
    public void heatEvent(int sensorId, double value);
}
