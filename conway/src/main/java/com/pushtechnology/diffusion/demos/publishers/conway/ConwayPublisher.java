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

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.data.record.RecordTopicData;
import com.pushtechnology.diffusion.api.message.TopicMessage;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.Publisher;
import com.pushtechnology.diffusion.api.publisher.Publishers;
import com.pushtechnology.diffusion.api.threads.RunnableTask;
import com.pushtechnology.diffusion.api.threads.ThreadService;
import com.pushtechnology.diffusion.api.topic.Topic;

/**
 * ConwayPublisher
 *<P>
 * A simple publisher to update a Conway's Game of Life instance. Each row in
 * the Grid corresponds to RecordTopicData The game logic runs in a thread, with
 * an update rate determined by GAME_SPEED_MS
 * @author tmclaughlan
 */
public class ConwayPublisher extends Publisher implements RunnableTask {

    /**
     * The base topic for the Publisher.
     */
    public static final String TOPIC = "conway";
    /** the game speed determines how long between each counter tick.
     * the counter resets every 5 ticks (then the game logic ticks)
     */
    public static final long GAME_SPEED_MS = 500L;
    /**
     * MAX_PLAYERS determines the maximum number of players to
     * add to a game.
     */
    public static final int MAX_PLAYERS = 10;

    private Topic parentTopic;

    // logger
    private final Logger logger = LoggerFactory
        .getLogger(ConwayPublisher.class);

    // to get a handle on the game instance
    private GameManager games;

    @Override
    protected void initialLoad() throws APIException {
        super.initialLoad();

        parentTopic = addTopic(TOPIC);

        games = new GameManager(parentTopic);

        Publishers.addEventListener(new ConwayClientListener(this));

        // we need the game logic to keep ticking, so use a thread
        ThreadService.schedule(this, 0L, ConwayPublisher.GAME_SPEED_MS,
            TimeUnit.MILLISECONDS, false);
    }

    @Override
    protected boolean isStoppable() {
        return true;
    }

    /**
     * A message has arrived from client, store it & broadcast it out to all
     * listeners.
     * @param message the received message.
     * @param client the client sending the message.
     */
    @Override
    protected void messageFromClient(final TopicMessage message,
        final Client client) {
        final Game game = games.getGameForClient(client);
        final Topic topic = getTopic(message.getTopicName());
        try {
            if (topic.getParent().getNodeName().equals(Game.SQUARE_TOPIC)) {

                final int yval = Integer.parseInt(topic.getNodeName());
                final int xval = Integer.parseInt(message.nextField());

                game.clientMessage(message, client, xval, yval);

            }
            else if (topic.getNodeName().equals(Game.REGISTER_TOPIC)) {
                games.addPlayer(client);
            }
        }
        catch (final APIException ex) {
            logger.warn("Exception caught", ex);
        }
    }

    @Override
    protected void subscription(final Client client, final Topic topic,
        final boolean loaded) throws APIException {

        final String topicNodeName = topic.getNodeName();
        final String topicParentNodeName = topic.getParent().getNodeName();

        // if the introspector joins, we don't want a game created for it
        if (TOPIC.equals(topicNodeName) &&
            !"Introspector Client".equals(
                client.getConnectionType().getDisplayName())) {
            games.addClient(client);
        }

        // send a list of currently active games to the client
        if (GameManager.GAMES_TOPIC.equals(topicNodeName)) {
            // client.send(games.createGamesListMessage());
            final Topic gameTopic =
                getTopic(TOPIC + "/" + GameManager.GAMES_TOPIC);
            client.send(gameTopic.getData().getLoadMessage());
        }

        // send out the initial state of the squares and connected players.
        if (Game.SQUARE_TOPIC.equals(topicNodeName) ||
            Game.PLAYER_TOPIC.equals(topicNodeName) ||
            Game.SQUARE_TOPIC.equals(topicParentNodeName) ||
            Game.PLAYER_TOPIC.equals(topicParentNodeName)) {
            final RecordTopicData data = (RecordTopicData) topic.getData();
            if (data != null) {
                final TopicMessage load = data.getLoadMessage();
                client.send(load);
            }
        }
    }

    /**
     * removePlayer
     * <P>
     * Remove a player from their game.
     *
     * @param client the client to remove
     */
    protected void removePlayer(final Client client) {

        final Game game = games.getGameForClient(client);

        if (game == null) {
            return;
        }
        games.removePlayer(client);
        if (game.getPlayers().size() < 1) {
            games.removeGame(game.getName());
        }

    }

    @Override
    protected void publisherStarted() throws APIException {
        logger.info("Started " + this.getClass().getName());
    }

    @Override
    protected void publisherStopped() throws APIException {
        logger.info("Stopped " + this.getClass().getName());
    }

    /**
     * this method is called every time the Thread ticks. it should run a tick
     * of the game logic and send any necessary message to update the client's
     * grid. a counter also runs, between 5 and 1, to update a visual counter on
     * the client which counts down between game logic ticks.
     */
    @Override
    public void run() {
        for (final Game game : games.getAllGames()) {
            game.tick();
        }
    }

}
