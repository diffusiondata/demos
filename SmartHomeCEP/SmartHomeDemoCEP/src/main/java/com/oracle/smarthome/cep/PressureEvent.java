/**
 *
 */
package com.oracle.smarthome.cep;

/**
 * @author ankinelaturu
 *
 */
public class PressureEvent {

    private String status;
    private Double pressure;
    private int sensorId;
    
    /**
     * @param value
     */
    public PressureEvent() {
    }

    /**
     * @return the value
     */
    public Double getpressure() {
        return pressure;
    }

    /**
     * @param value the value to set
     */
    public void setpressure(Double pressure) {
        this.pressure = pressure;
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
        return "PressureEvent{" + "sensorId=" + getSensorId() + ", status=" + status + ", pressure=" + pressure + '}';
    }
    
}
