package com.oracle.smarthome.cep;

public class House {

    private static boolean heaterOn;
    private static boolean lightOn;

    public static synchronized String turnOnHeater() {
        System.out.println("Turning Heater On");
        if (heaterOn) {
            System.out.println("    Already ON");
            return "Heater On";
        }
        heaterOn = true;

        return "Heater On";
    }

    public static synchronized String turnOffHeater() {
        System.out.println("Turning Heater Off");
        if (!heaterOn) {
            System.out.println("    Already Off");
            return "Heater Off";
        }
        heaterOn = false;

        return "Heater Off";
    }

    public static synchronized String turnOnLight() {
        System.out.println("Turning Lights ON");
        if (lightOn) {
            System.out.println("    Already ON");
            return "Light On";
        }
        lightOn = true;

        return "Light On";
    }

    public static synchronized String turnOffLight() {
        System.out.println("Turning Lights Off");
        if (!lightOn) {
            System.out.println("    Already OFF");
            return "Light Off";
        }
        lightOn = false;

        return "Light Off";
    }

}
