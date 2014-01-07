/*
 * Copyright (C) 2013 Push Technology Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.pushtechnology.diffusion.demos.publishers.conway;

import java.util.ArrayList;
import java.util.List;

/**
 * Row
 *<P>
 * This class contains a List of squares, which hold the state of a
 * specific row in the Game of Life grid.
 *
 * @author tmclaughlan
 */
public class Row {

    private final int rowLength;
    private final List<Integer> squares;
    private final boolean[] changed;

    /**
     * Constructor.
     * @param length the length of the Row to create
     */
    public Row(final int length) {
        rowLength = length;
        squares = new ArrayList<Integer>();
        changed = new boolean[rowLength];
        // initialise all squares to 0
        for (int x = 0; x < rowLength; ++x) {
            squares.add(0);
            changed[x] = false;
        }
    }

    /**
     * Does the Row contain only inactive cells?
     *
     * @return true if the row contains no active cells.
     */
    public boolean isEmpty() {
        // if there are no active cells in a row, return true
        for (int i = 1; i <= ConwayPublisher.MAX_PLAYERS; ++i) {
            if (squares.contains(i)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get a List of squares in the Row that have been modified.
     *
     * @return a List of the modified squares by x coordinate
     */
    public List<Integer> getChanges() {
        final List<Integer> res = new ArrayList<Integer>();

        for (int x = 0; x < rowLength; ++x) {
            if (changed[x]) {
                res.add(x);
                changed[x] = false;
            }
        }

        return res;
    }

    /**
     * Clear any active changes in the row.
     */
    public void clearChanges() {
        for (int x = 0; x < rowLength; ++x) {
            changed[x] = false;
        }
    }

    /**
     * Get the value of the square at position x.
     *
     * @param x the x coordinate
     * @return the value of the square
     */
    public int getSquare(final int x) {
        if (x >= 0 && x < rowLength) {
            return squares.get(x);
        }

        return -1;
    }

    /**
     * Get the length of this row.
     *
     * @return the row length
     */
    public int length() {
        return rowLength;
    }

    /**
     * Set the square at x to a new value, v.
     *
     * @param x the x coordinate
     * @param v the new value for the square
     */
    public void setSquare(final int x, final int v) {
        if (x >= 0 && x < rowLength && squares.get(x) != v) {
            squares.remove(x);
            squares.add(x, v);
            changed[x] = true;
        }

    }

}
