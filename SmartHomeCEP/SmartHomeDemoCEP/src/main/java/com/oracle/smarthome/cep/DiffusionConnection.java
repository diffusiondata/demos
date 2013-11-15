package com.oracle.smarthome.cep;

import java.util.List;

import com.bea.wlevs.ede.api.InitializingBean;
import com.pushtechnology.diffusion.api.ServerConnection;
import com.pushtechnology.diffusion.api.client.ExternalClientConnection;
import com.pushtechnology.diffusion.api.message.TopicMessage;

public class DiffusionConnection extends ServerConnectionAdapter implements InitializingBean {

    private String serverUri;
    private ExternalClientConnection clientConnection;
    private HeatEventListener heatEventListener;
    private LightEventListener lightEventListener;
    private PressureEventListener pressureEventListener;
    private ModeEventListener modeEventListener;

    public enum Device {
        Heater, Light
    }

    public void setServerUri(String serverUri) {
        this.serverUri = serverUri;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        try {
            clientConnection = new ExternalClientConnection(this, serverUri);
            System.out.printf("Connecting to Diffusion [%s]%n", serverUri);
            clientConnection.connect("Sensors//");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendControlMessage(Device device, String control) {
        try {
            System.out.printf("Sending %s for device %s%n", control, device.name());

            TopicMessage message = clientConnection.createDeltaMessage("Sensors/Control/" + device.name());
            message.putFields(control);
            clientConnection.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void messageFromServer(ServerConnection serverConnection, TopicMessage topicMessage) {
        String topicName = topicMessage.getTopicName();
        String[] split = topicName.split("/");
        try {
            if (split[1].equals("Readings")) {
                String type = split[split.length - 1];

                List<String> fields = topicMessage.asFields();
                String sensor = fields.get(0);
                // TODO unhard code
                int sensorId = 1;
                String valString = fields.get(1);
                double value = Double.valueOf(valString);
                System.out.printf("type[%s] id[%s] value[%.1f]%n", type, sensorId, value);

                if (type.equals("Temp")) {
                    heatEventListener.heatEvent(sensorId, value);
                } else if (type.equals("Light")) {
                    lightEventListener.lightEvent(sensorId, (int) value);
                } else if (type.equals("Pressure")) {
                    pressureEventListener.pressureEvent(sensorId, value);
                } else {
                    System.err.println("Unknown sensor type:" + type);
                }
            } else if (topicName.equals("Sensors/Control")) {
                System.out.printf("Control mode [%s]%n", topicMessage.toString());
                List<String> fields = topicMessage.asFields();
                String mode = fields.get(0);
                Double ttl = fields.get(1) == null || fields.get(1).trim().equals("") ? null : Double.parseDouble(fields.get(1));
                Double tth = fields.get(2) == null || fields.get(2).trim().equals("") ? null : Double.parseDouble(fields.get(2));
                Double tte = fields.get(3) == null || fields.get(3).trim().equals("") ? null : Double.parseDouble(fields.get(3));
                Integer tl = fields.get(4) == null || fields.get(4).trim().equals("") ? null : Integer.parseInt(fields.get(4));
                modeEventListener.modeEvent(mode, ttl, tth, tte, tl);
            }
        } catch (Exception e) {
            System.err.printf("ERROR: %s%n", e.getMessage());
            e.printStackTrace();
        }
    }

    public void addHeatEventListener(String string, HeatEventListener heatEventListener) {
        this.heatEventListener = heatEventListener;
    }

    public void addLightEventListener(String string, LightEventListener lightEventListener) {
        this.lightEventListener = lightEventListener;
    }

    public void addPressureEventListener(String string, PressureEventListener pressureEventListener) {
        this.pressureEventListener = pressureEventListener;
    }

    public void addModeEventListener(ModeEventListener modeEventListener) {
        this.modeEventListener = modeEventListener;
    }

}
