package com.push;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;

import com.pushtechnology.diffusion.api.ServerConnection;
import com.pushtechnology.diffusion.api.client.ExternalClientConnection;

public class Sensors extends ServerConnectionAdapter {

    private static Logger log = Logger.getLogger(Sensors.class);

    private ExternalClientConnection clientConnection;
    private List<HeatSensor> heatSensors = new ArrayList<HeatSensor>();
    private List<LightSensor> lightSensors = new ArrayList<LightSensor>();
    private CountDownLatch countDownLatch;
    private int numRooms = 1;

    public static void main(String[] args) {
        BasicConfigurator.configure();
        new Sensors("dpt://localhost:8080");
    }

    public Sensors(String serverUri) {
        countDownLatch = new CountDownLatch(2 * numRooms);
        try {
            log.info("Connecting to server ...");
            clientConnection = new ExternalClientConnection(this, serverUri);
            clientConnection.connect("Sensors/Readings//");
            countDownLatch.await();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void serverConnected(ServerConnection serverConnection) {
        log.info("Connected to server");

        for (int i = 1; i <= numRooms; i++) {
            heatSensors.add(new HeatSensor(clientConnection, countDownLatch, "room" + i));
            lightSensors.add(new LightSensor(clientConnection, countDownLatch, "room" + i));
        }
    }

    @Override
    public void serverDisconnected(ServerConnection serverConnection) {
        for (HeatSensor heatSensor : heatSensors) {
            heatSensor.stop();
        }
        for (LightSensor lightSensor : lightSensors) {
            lightSensor.stop();
        }
    }
}
