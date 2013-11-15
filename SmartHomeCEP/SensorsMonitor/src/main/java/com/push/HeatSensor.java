package com.push;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.pushtechnology.diffusion.api.client.ExternalClientConnection;
import com.pushtechnology.diffusion.api.message.TopicMessage;

public class HeatSensor implements Runnable {

    private static Logger log = Logger.getLogger(HeatSensor.class);

    private static File heaterFile = null;
    private static Random random = new Random(System.currentTimeMillis());
    private String sensorId;
    private ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
    private final ExternalClientConnection clientConnection;
    private final CountDownLatch countDownLatch;
    private static double lastTemp = 15;

    private final String name;

    static {
        String str = DevicePathFinder.find("08f7", "0002");
        if (str != null) {
            heaterFile = new File(str);
        }
    }

    public HeatSensor(ExternalClientConnection clientConnection, CountDownLatch countDownLatch, String name) {
        this.clientConnection = clientConnection;
        this.countDownLatch = countDownLatch;
        this.name = name;
        executor.scheduleAtFixedRate(this, 0, 2, TimeUnit.SECONDS);
    }

    public void stop() {
        executor.shutdownNow();
        countDownLatch.countDown();
    }

    public void run() {
        try {
            Double v = readValue();
            log.info("Sending temp reading : " + v);

            TopicMessage message = clientConnection.createDeltaMessage("Sensors/Readings/Temp");
            message.putRecord(name, v.toString());
            clientConnection.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static double readValue() {
        if (heaterFile == null) {
            lastTemp = lastTemp + (5d - random.nextInt(100) / 10d);
            if (lastTemp < 5) {
                lastTemp = 5;
            }
            if (lastTemp > 30) {
                lastTemp = 30;
            }
            return lastTemp;
        }
        double result = 0.0;

        FileInputStream fis = null;
        DataInputStream dis = null;
        try {
            fis = new FileInputStream(heaterFile);
            dis = new DataInputStream(fis);

            // Get temperature from Actual GoTemp Sensor
            byte b[];
            double realtemp, c, f;
            int samplecount = 0, sequence = 0, temp1 = 0, temp2 = 0, temp3 = 0;

            b = new byte[8];
            short[] s = new short[b.length];

            dis.read(b, 0, 8);
            samplecount = b[0];
            sequence = b[1];
            for (int idx = 0; idx < 8; idx++) {
                s[idx] = (short) (b[idx] & 0xff);
            }
            temp1 = s[2] + s[3] * 256;
            temp2 = s[4] + s[5] * 256;
            temp3 = s[6] + s[7] * 256;

            // We only use temp1. temp2 and temp3 is dull.
            realtemp = temp1;
            c = realtemp / 126.74 - 5.4;

            result = Math.round(c);

            dis.close();
            dis = null;
            fis.close();
            fis = null;
        } catch (IOException ex) {
            ex.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException ex2) {
                    ex2.printStackTrace();
                }
            }
        }

        return result;
    }

}
