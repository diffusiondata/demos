package com.oracle.smarthome.cep;

public class HeatEvent {

    private String status;
    private Double temperature;
    private int sensorId;
    
    /**
     * @param value
     */
    public HeatEvent() {
    }

    /**
     * @return the value
     */
    public Double getTemperature() {
        return temperature;
    }

    /**
     * @param value the value to set
     */
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
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
        return "HeatEvent{" + "sensorId=" + getSensorId() + ", status=" + status + ", temperature=" + temperature + '}';
    }
    
}
