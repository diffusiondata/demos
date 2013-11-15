package com.oracle.smarthome.cep;

public interface PressureEventListener {
    public void pressureEvent(int sensorId, double value);
}
