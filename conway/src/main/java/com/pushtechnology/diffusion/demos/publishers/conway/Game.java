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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.TopicDataFactory;
import com.pushtechnology.diffusion.api.data.TopicDataType;
import com.pushtechnology.diffusion.api.data.metadata.MDataType;
import com.pushtechnology.diffusion.api.data.metadata.MMessage;
import com.pushtechnology.diffusion.api.data.metadata.MRecord;
import com.pushtechnology.diffusion.api.data.metadata.MetadataFactory;
import com.pushtechnology.diffusion.api.data.metadata.Multiplicity;
import com.pushtechnology.diffusion.api.data.record.RecordTopicData;
import com.pushtechnology.diffusion.api.data.single.SingleValueTopicData;
import com.pushtechnology.diffusion.api.message.TopicMessage;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.topic.Topic;

/**
 * Game
 *<P>
 * This class defines a single game in the Game of Life.
 * The GameManager creates and manages Games.
 *
 * @author tmclaughlan
 */
public class Game {

    private final Grid grid;
    private final int gridSize = 50;
    private final int[] scores;
    private final int[] connections;
    private final String name;
    /**
     * The topic name for the topic storing the state of the grid.
     */
    public static final String SQUARE_TOPIC = "SquareState";
    /**
     * The topic name for the topic storing the list of current players.
     */
    public static final String PLAYER_TOPIC = "Players";
    /**
     * The topic name for the control topic used when registering a player.
     */
    public static final String REGISTER_TOPIC = "Register";
    /**
     * The topic name for the topic controlling the ticker.
     */
    public static final String COUNTER_TOPIC = "Counter";

    private int maxPlayers = 10;

    private int counts = 5;

    private final Topic gameTopic;
    // players
    private List<Player> thePlayers = new ArrayList<Player>();
    private MMessage playerConnections = null;
    private final Topic connectionTopic;

    private final Logger logger = LoggerFactory.getLogger(Game.class);

    /**
     * Constructor.
     * @param gameName the name of the game
     * @param parent the parent topic
     * @throws APIException exception thrown when modifying topics
     */
    public Game(final String gameName, final Topic parent) throws APIException {
        name = gameName;
        gameTopic = parent.addTopic(gameName);

        final SingleValueTopicData countData =
            TopicDataFactory.newSingleValueData(MDataType.INTEGER_STRING);
        countData.initialise(counts);
        gameTopic.addTopic(COUNTER_TOPIC, countData);

        // Register topic used for receiving player registration messages.
        gameTopic.addTopic(PLAYER_TOPIC + "/" + REGISTER_TOPIC);

        final String playerNum = PLAYER_TOPIC + "/Connected";
        playerConnections = MetadataFactory.newMetadata("player",
            TopicDataType.RECORD);
        final MRecord record =
            playerConnections.addRecord("player",
                new Multiplicity(ConwayPublisher.MAX_PLAYERS,
                    ConwayPublisher.MAX_PLAYERS));

        record.addField("playerindex", MDataType.INTEGER_STRING);
        record.addField("connected", MDataType.INTEGER_STRING);
        record.addField("score", MDataType.INTEGER_STRING);

        final RecordTopicData pdata =
            TopicDataFactory.newRecordData(playerConnections);
        connectionTopic = gameTopic.addTopic(playerNum, pdata);

        grid = new Grid(gridSize);

        // create a topic for each row in the grid
        for (int y = 0; y < gridSize; ++y) {
            MMessage rows = null;
            rows = MetadataFactory.newMetadata(String.valueOf(y),
                TopicDataType.RECORD);
            final MRecord rowRecord =
                rows.addRecord(String.valueOf(y), Multiplicity.SINGLE_REQUIRED);

            for (int x = 0; x < gridSize; ++x) {
                rowRecord.addField(String.valueOf(x), MDataType.INTEGER_STRING);
            }

            final RecordTopicData rdata = TopicDataFactory.newRecordData(rows);
            gameTopic.addTopic(SQUARE_TOPIC + "/" + String.valueOf(y), rdata);
        }

        scores = new int[ConwayPublisher.MAX_PLAYERS];
        connections = new int[ConwayPublisher.MAX_PLAYERS];
        for (int i = 0; i < ConwayPublisher.MAX_PLAYERS; ++i) {
            scores[i] = 0;
            connections[i] = 0;
        }
    }

    /**
     * Get the name of this game.
     *
     * @return the name of the game.
     */
    public String getName() {
        return name;
    }

    /**
     * Get the topic associated with this game.
     *
     * @return the topic.
     */
    public Topic getTopic() {
        return gameTopic;
    }

    /**
     * Get the topic associated with the player connection information.
     *
     * @return the topic.
     */
    public Topic getConnectionTopic() {
        return connectionTopic;
    }

    /**
     * Gets a list of players in this game.
     *
     * @return a list of players.
     */
    public List<Player> getPlayers() {
        return thePlayers;
    }

    /**
     * Adds a player (client) to this game.
     * <P>
     * This method will add a new Player to the list of Players in
     * this game, and update the topic information.
     *
     * @param client the client to add to the game
     */
    public void addPlayer(final Client client) {
        int newIndex = 0;
        for (int i = 1; i <= maxPlayers; ++i) {
            boolean freeindex = true;
            synchronized (thePlayers) {
                for (final Player p : thePlayers) {
                    if (p.getIndex() == i) {
                        freeindex = false;
                    }
                }
                if (freeindex) {
                    newIndex = i;
                    break;
                }
            }
        }
        if (thePlayers.size() < maxPlayers) {
            thePlayers.add(new Player(client.getClientID(), newIndex));
        }

        connectPlayer(newIndex);

        final RecordTopicData playerData =
            (RecordTopicData) connectionTopic.getData();
        try {
            playerData.startUpdate();
            playerData.update("player", newIndex - 1, "playerindex", newIndex);
            playerData.update("player", newIndex - 1, "connected", 1);
            playerData.update("player", newIndex - 1, "score", 0);
            playerData.endUpdate();
            final TopicMessage playerLoad = playerData.getLoadMessage();
            gameTopic.publishMessage(playerLoad);
        }
        catch (APIException ex) {
            logger.info("Exception caught", ex);
        }
    }

    /**
     * Remove a player from the game
     * <P>
     * This method searches the list of Players for the Player matching the
     * Client to remove. The player is removed from the list and the
     * topics are updated to remove everything associated with that player.
     *
     * @param client the client to remove from the game
     */
    public void removePlayer(final Client client) {
        int index = -1;
        synchronized (thePlayers) {
            for (final Player p : thePlayers) {
                if (client.getClientID().equals(p.getClientID())) {
                    thePlayers.remove(p);
                    index = p.getIndex();
                    removeSquaresForPlayer(index);

                    disconnectPlayer(index);
                    updateScores();

                    break;
                }
            }
        }

        if (index != -1) {
            final RecordTopicData playerData =
                (RecordTopicData) connectionTopic.getData();
            try {
                playerData.startUpdate();
                playerData.update("player", index - 1, "connected", 0);
                playerData.update("player", index - 1, "score", 0);
                playerData.endUpdate();
                playerData.publishMessage(playerData.getLoadMessage());
            }
            catch (APIException ex) {
                logger.info("Exception caught", ex);
            }
        }
    }

    private void removeSquaresForPlayer(final int index) {
        // remove a players squares
        for (int y = 0; y < gridSize; ++y) {
            final RecordTopicData newSquare =
                (RecordTopicData) gameTopic.getTopic(
                    Game.SQUARE_TOPIC + "/" + y).getData();
            try {
                newSquare.startUpdate();
                for (int x = 0; x < gridSize; ++x) {
                    if (getSquare(x, y) == index) {
                        setSquare(x, y, 0);
                        newSquare.update(String.valueOf(y), 0,
                            String.valueOf(x), 0);
                    }
                }
                newSquare.publishMessage(newSquare.generateDeltaMessage());
            }
            catch (final APIException ex) {
                logger.warn("Exception caught", ex);
            }
            finally {
                newSquare.endUpdate();
            }
        }
    }

    /**
     * Set the connection state for a player to online.
     *
     * @param i the player's number
     */
    public void connectPlayer(final int i) {
        if (i > 0 && i <= maxPlayers) {
            connections[i - 1] = 1;
        }
    }

    /**
     * Set the connection state for a player to offline.
     *
     * @param i the player's number
     */
    public void disconnectPlayer(final int i) {
        if (i > 0 && i <= maxPlayers) {
            connections[i - 1] = 0;
        }
    }
    /**
     * Get the grid dimension. The grid dimensions are always equal.
     *
     * @return the grid size
     */
    public int getGridSize() {
        return gridSize;
    }

    /**
     * Get the score for a given player.
     *
     * @param index the player's number
     * @return the score
     */
    public int getScore(final int index) {
        return scores[index - 1];
    }

    /**
     * Get the state of a square, given the x and y position.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @return the state of the square
     */
    public int getSquare(final int x, final int y) {
        return grid.getRow(y).getSquare(x);
    }

    /**
     * Set the state of a square, given the x and y position
     * and a value, v.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @param v the value to set the square to
     */
    public void setSquare(final int x, final int y, final int v) {
        grid.getRow(y).setSquare(x, v);
    }

    /**
     * Get a count of adjacent squares of value, v.
     * <P>
     * Each square has 8 neighbouring squares with a specific value.
     * This method will count the number of squares adjacent to the position
     * (x,y) with a value of v.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @param v the value to count
     * @return the number of neighbouring squares with value, v
     */
    public int getAdjacent(final int x, final int y, final int v) {

        int activeAdj = 0;

        for (int i = -1; i <= 1; ++i) {
            for (int j = -1; j <= 1; ++j) {
                if (i == 0 && j == 0) {
                    continue;
                }
                int accessx = x + i;
                int accessy = y + j;
                if (accessx < 0) {
                    accessx = gridSize - 1;
                }
                else if (accessx > gridSize - 1) {
                    accessx = 0;
                }
                if (accessy < 0) {
                    accessy = gridSize - 1;
                }
                else if (accessy > gridSize - 1) {
                    accessy = 0;
                }

                if (grid.getRow(accessy).getSquare(accessx) == v) {
                    activeAdj++;
                }
            }
        }
        return activeAdj;
    }

    private int squareLogic(final int x, final int y, final int player,
        final int bufferVal) {
        final int activeAdj = getAdjacent(x, y, player);
        int hostileAdj = 0;
        for (int j = 1; j <= maxPlayers; ++j) {
            if (j == player || connections[j - 1] == 0) {
                continue;
            }
            hostileAdj += getAdjacent(x, y, j);
        }
        return squareRules(activeAdj, hostileAdj,
            grid.getRow(y).getSquare(x), bufferVal, player);

    }

    private int squareRules(final int activeAdj, final int hostileAdj,
        final int squareVal, final int bufferVal, final int player) {
        // RULES!
        // if dead and exactly 3 adjacent, become a new healthy cell
        if (activeAdj == 3 && squareVal == 0) {
            return bufferVal > 0 ? 0 : player;

        }
        else if (squareVal == player) {
            // if healthy and exactly 2 or 3 adjacent, then remain
            // healthy/heal
            if ((activeAdj == 2 || activeAdj == 3) && hostileAdj < 3) {
                return player;
            }
            else {
                return 0;
            }
        }
        return bufferVal;
    }

    private void playerTick(final int player, final Grid buffer) {
        for (int x = 0; x < gridSize; ++x) {
            for (int y = 0; y < gridSize; ++y) {
                buffer.getRow(y).setSquare(x,
                    squareLogic(x, y, player, buffer.getRow(y).getSquare(x)));
            }
        }
    }

    private List<ArrayList<Integer>> gameLogicTick() {
        final Grid buffer = grid.cloneGrid();

        for (int i = 1; i <= maxPlayers; ++i) {
            // if the player isn't connected, we shouldn't bother counting their
            // non-existent squares
            if (connections[i - 1] == 0) {
                continue;
            }
            playerTick(i, buffer);
        }

        final List<ArrayList<Integer>> changes =
            new ArrayList<ArrayList<Integer>>();
        for (int y = 0; y < gridSize; ++y) {
            for (int x = 0; x < gridSize; ++x) {
                if (grid.getRow(y).getSquare(x) != buffer.getRow(y)
                    .getSquare(x)) {
                    grid.getRow(y).setSquare(x, buffer.getRow(y).getSquare(x));
                }
            }
            changes.add((ArrayList<Integer>) grid.getRow(y).getChanges());
        }
        return changes;
    }

    /**
     * On receipt of a message from a client, update the grid and publish
     * the new grid state.
     * <P>
     * This method is called by ConwayPublisher.messageFromClient(..) when a
     * message is received. The client will broadcast a message when a square is
     * clicked.
     *
     * @param message the message from the client
     * @param client the client sending the message
     * @param x the x coordinate of the square clicked
     * @param y the y coordinate of the square clicked
     */
    public void clientMessage(final TopicMessage message, final Client client,
        final int x, final int y) {
        // the content of the message (the new value of the square)
        int newval = 0;

        for (final Player p : thePlayers) {
            if (p.getClientID().equals(client.getClientID())) {
                newval = p.getIndex();
                break;
            }
        }

        // only allow a cell to be placed if the square is empty
        if (getSquare(x, y) == 0) {
            setSquare(x, y, newval);

            final RecordTopicData newSquare =
                (RecordTopicData) gameTopic.getTopic(SQUARE_TOPIC + "/" + y)
                    .getData();
            try {
                newSquare.startUpdate();
                newSquare.update(String.valueOf(y), 0,
                    String.valueOf(x), newval);
                newSquare.publishMessage(newSquare.generateDeltaMessage());
            }
            catch (APIException ex) {
                logger.info("Exception caught", ex);
            }
            finally {
                newSquare.endUpdate();
            }
        }
    }

    /**
     * Perform a game tick.
     * <P>
     * A single tick will run the game logic, update the scores
     * and broadcast any changes to the topic data.
     */
    public void tick() {

        if (counts > 1) {
            counts--;
        }
        else if (counts == 1) {
            counts = 5;

            // get a list of changes to the grid and update the topics
            // accordingly
            // the square data is stored as rows in both the topic and the Grid
            // class
            // we should publish changes to each row as a single message
            updateGrid(gameLogicTick());
            updateScores();

            final RecordTopicData playerData =
                (RecordTopicData) connectionTopic.getData();

            try {
                playerData.startUpdate();
                for (int i = 0; i < maxPlayers; ++i) {
                    playerData.update("player", i, "score", getScore(i + 1));
                }

                if (playerData.hasChanges()) {
                    playerData
                        .publishMessage(playerData.generateDeltaMessage());
                }
            }
            catch (final APIException ex) {
                logger.warn("Exception caught", ex);
            }
            finally {
                playerData.endUpdate();
            }

        }

        try {
            final Topic tmpTopic = gameTopic.getTopic(COUNTER_TOPIC);
            ((SingleValueTopicData) tmpTopic.getData())
                .updateAndPublish(counts);
        }
        catch (final APIException ex) {
            logger.warn("Exception caught", ex);
        }
    }

    private void updateGrid(final List<ArrayList<Integer>> changes) {
        for (int y = 0; y < gridSize; ++y) {

            // changes are stored as a list of x coordinates.
            final List<Integer> rowChanges = changes.get(y);

            // if we have no changes, we don't need to update!
            if (rowChanges.isEmpty()) {
                continue;
            }
            final RecordTopicData data =
                (RecordTopicData) gameTopic
                    .getTopic(SQUARE_TOPIC + "/" + y).getData();
            try {
                data.startUpdate();
                // update all changes for the row
                for (int i = 0; i < rowChanges.size(); ++i) {
                    final int xval = rowChanges.get(i);
                    data.update(String.valueOf(y), 0, String.valueOf(xval),
                        getRow(y).getSquare(xval));
                }
                data.publishMessage(data.generateDeltaMessage());
            }
            catch (final APIException ex) {
                logger.warn("Exception caught", ex);
            }
            finally {
                data.endUpdate();
            }
        }
    }

    /**
     * Get the Row at y.
     *
     * @param y the y coordinate
     * @return the Row at y
     */
    public Row getRow(final int y) {
        return grid.getRow(y);
    }

    /**
     * Update the scores based on the current state of the grid.
     */
    public void updateScores() {
        for (int i = 0; i < maxPlayers; ++i) {
            scores[i] = 0;
        }

        for (int x = 0; x < gridSize; ++x) {
            for (int y = 0; y < gridSize; ++y) {
                if (grid.getRow(y).getSquare(x) > 0) {
                    scores[grid.getRow(y).getSquare(x) - 1]++;
                }
            }
        }
    }

}
