package com.oracle.smarthome.cep;

public class LightEvent {

    private String status;
    private int intensity;
    private int sensorId;

    public LightEvent() {
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        this.intensity = intensity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getSensorId() {
        return sensorId;
    }

    public void setSensorId(int sensorId) {
        this.sensorId = sensorId;
    }

    @Override
    public String toString() {
        return "LightEvent{" + "sensorId=" + getSensorId() + ", status=" + status + ", intensity=" + intensity  + '}';
    }
}
