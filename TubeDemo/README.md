Live tube train demo
====================

Overview
--------

This demo polls for data from the Transport for London (TfL) website
and parses it into Diffusion topics for the purposes of display
real-time tube train locations on a browser.


Prerequisites
-------------

- Diffusion (tested with 4.5.0)
- An Internet connection
- Maven 3.0.5 and above


Building and installing
-----------------------

1. Run `mvn clean install` in the `TubeDemo` directory .

2. Copy `TubeDemo-0.0.1.dar` from the `./target` folder into the `./deploy` folder
inside your Diffusion installation.

3. Start Diffusion.


Running
-------

Point your web browser to `http://localhost:8080/demos/` and click on the `View Demos` link
under `Tube`.

Notes
-----

- Not all tube lines are available at this time.

- Due to the non-normalised data from TfL, we have to use a series of
  heuristics when parsing their data. Given some effort, it would be
  possible to improve these heuristics.

- TfL do not implement a live stream themselves and only update the
  public data at 30 second intervals, so we interpolate the positions
  of trains for animation purposes.
