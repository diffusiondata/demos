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

/**
 * Player
 *<P>
 * This class keeps a record of player data.
 *
 * @author tmclaughlan
 */
public class Player {

    private String clientID = "";
    private int score = 0;
    private int index = -1;

    /**
     * Constructor.
     * @param clientID the client ID of this player
     * @param index the index to assign. The index is calculated by
     * the GameManager.
     */
    public Player(final String clientID, final int index) {
        this.clientID = clientID;
        this.index = index;
    }

    /**
     * Get the index of this player.
     *
     * @return the player index
     */
    public int getIndex() {
        return index;
    }

    /**
     * Get the score for this player.
     *
     * @return the players score
     */
    public int getScore() {
        return score;
    }

    /**
     * Get the players client ID.
     *
     * @return the client ID
     */
    public String getClientID() {
        return clientID;
    }

    /**
     * Add to the players current score.
     *
     * @param inc the score to add
     */
    public void addScore(final int inc) {
        score += inc;
    }

}
