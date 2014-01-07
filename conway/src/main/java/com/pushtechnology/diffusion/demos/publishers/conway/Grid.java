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
 * Grid
 *<P>
 * A grid to store the Game of Life state.
 * The Grid is made up of Rows, each Row containing gridSize squares (Integers)
 *
 * @author tmclaughlan
 */
public class Grid {

    private final int gridSize;
    private final List<Row> rows;

    /**
     * Constructor.
     * @param size the size of the grid to create
     */
    public Grid(final int size) {
        gridSize = size;
        rows = new ArrayList<Row>();
        for (int y = 0; y < gridSize; ++y) {
            rows.add(new Row(gridSize));
        }
    }

    /**
     * Create an exact copy of the Grid as a new object.
     * <P>
     * This is used to create a 'buffer' Grid, when calculating the game logic.
     *
     * @return the cloned Grid
     */
    public Grid cloneGrid() {
        final Grid res = new Grid(gridSize);
        for (int y = 0; y < gridSize; ++y) {
            final Row currentRow = rows.get(y);
            if (currentRow.isEmpty()) {
                continue;
            }
            final Row newRow = res.getRow(y);
            for (int x = 0; x < currentRow.length(); ++x) {
                newRow.setSquare(x, currentRow.getSquare(x));
            }
            newRow.clearChanges();
        }

        return res;
    }

    /**
     * Get a row from the grid, at a given y coordinate.
     *
     * @param y the y coordinate
     * @return the Row
     */
    public Row getRow(final int y) {
        if (y >= 0 && y < gridSize) {
            return rows.get(y);
        }

        return null;
    }

}
