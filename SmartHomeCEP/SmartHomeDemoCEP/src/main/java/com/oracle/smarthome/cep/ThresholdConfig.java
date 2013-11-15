package com.oracle.smarthome.cep;

public class ThresholdConfig {

    private int sensorId = 1;
    private double ttl = 15; // temp low
    private double tth = 25; // temp high
    private double tte = 35; // temp emergency
    private int tl = 5; // light
    private String mode = "auto";

    public double getTtl() {
        return ttl;
    }

    public void setTtl(double ttl) {
        this.ttl = ttl;
    }

    public double getTth() {
        return tth;
    }

    public void setTth(double tth) {
        this.tth = tth;
    }

    public double getTte() {
        return tte;
    }

    public void setTte(double tte) {
        this.tte = tte;
    }

    public int getTl() {
        return tl;
    }

    public void setTl(int tl) {
        this.tl = tl;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public int getSensorId() {
        return sensorId;
    }

    public void setSensorId(int sensorId) {
        this.sensorId = sensorId;
    }

    @Override
    public String toString() {
        return "ThresholdConfig-" +   this.hashCode() +" {" + "sensorId=" + sensorId + ", ttl=" + ttl + ", tth=" + tth + ", tte=" + tte + ", tl=" + tl + ", mode=" + mode + '}';
    }
    
    
    
}
