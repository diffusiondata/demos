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
- Apache Ant


Building and installing
-----------------------

1. Start Diffusion.

2. Edit build.xml and change the property `diffusion.jar` to point at
the diffusion.jar on your system.

3. `ant makedeploy` creates a DAR file for hot deployment.

4. `ant deploy` deploys to a running instance of Diffusion.


Running
-------

Point your web browser to `http://localhost:8080/tube`.

Notes
-----

- Not all tube lines are available at this time.

- Due to the non-normalised data from TfL, we have to use a series of
  heuristics when parsing their data. Given some effort, it would be
  possible to improve these heuristics.

- TfL do not implement a live stream themselves and only update the
  public data at 30 second intervals, so we interpolate the positions
  of trains for animation purposes.