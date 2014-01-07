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
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.api.APIException;
import com.pushtechnology.diffusion.api.Credentials;
import com.pushtechnology.diffusion.api.data.TopicDataFactory;
import com.pushtechnology.diffusion.api.data.TopicDataType;
import com.pushtechnology.diffusion.api.data.metadata.MDataType;
import com.pushtechnology.diffusion.api.data.metadata.MMessage;
import com.pushtechnology.diffusion.api.data.metadata.MRecord;
import com.pushtechnology.diffusion.api.data.metadata.MetadataFactory;
import com.pushtechnology.diffusion.api.data.metadata.Multiplicity;
import com.pushtechnology.diffusion.api.data.record.RecordTopicData;
import com.pushtechnology.diffusion.api.message.Record;
import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.topic.Topic;

/**
 * GameManager
 *<P>
 * This class creates and manages Game instances. Topic data on the list
 * of current games and players is also managed.
 *
 * @author tmclaughlan
 */
public class GameManager {
    /**
     * The parent topic name for all games.
     */
    public static final String GAMES_TOPIC = "games";
    private Topic gamesTopic;
    private ConcurrentMap<String, Game> activeGames = null;
    private final Logger logger = LoggerFactory.getLogger(GameManager.class);
    private MMessage meta;
    private MRecord gameRecordMetaData;

    /**
     * Constructor.
     * @param parent the parent topic for each game
     */
    public GameManager(final Topic parent) {
        activeGames = new ConcurrentHashMap<String, Game>();

        RecordTopicData topicData = null;
        try {
            meta = MetadataFactory.newMetadata("games", TopicDataType.RECORD);
            gameRecordMetaData =
                meta.addRecord("gameslist", new Multiplicity(0, -1));
            gameRecordMetaData.addField("game", MDataType.STRING);
            gameRecordMetaData.addField("players", MDataType.INTEGER_STRING);
            topicData = TopicDataFactory.newRecordData(meta);
            // topicData.set
            topicData.initialise(Collections.<Record>emptyList());
        }
        catch (final APIException ex) {
            logger.warn("Exception caught", ex);
        }

        try {
            gamesTopic = parent.getTopic(GAMES_TOPIC);
            if (gamesTopic == null) {
                gamesTopic = parent.addTopic(GAMES_TOPIC, topicData);
            }
        }
        catch (final APIException ex) {
            logger.warn("Exception caught", ex);
        }
    }

    /**
     * Add a client to a game.
     * <P>
     * This method calls getGameName(..) which looks at the client
     * credentials in order to find the gameName. If that game
     * exists, return the Game, otherwise create and return a new Game.
     *
     * @param client the client to join to a game
     * @return the Game joined
     */
    public Game addClient(final Client client) {
        final String gameName = getGameName(client);
        Game game = activeGames.get(gameName);

        final RecordTopicData topicData =
            (RecordTopicData) gamesTopic.getData();
        try {
            final List<Record> gameData = topicData.getState();
            if (game == null) {
                game = new Game(gameName, gamesTopic);
                activeGames.put(gameName, game);

                // add a record containing the game name, to send to the client
                final Record rec = new Record(gameRecordMetaData);
                rec.setField("game", gameName);
                rec.setField("players", game.getPlayers().size());
                // because we cannot update RecordTopicData to an empty
                // container a workaround is to set an empty Record
                // as the sole occupier of a List. If we have removed
                // the last game, this will be the contents of the TopicData.
                // because of this, we need to remove that empty topic
                // before adding a new game.
                if (activeGames.size() == 1 && gameData.size() == 1) {
                    gameData.remove(0);
                }
                gameData.add(rec);
                topicData.startUpdate();
                topicData.update(gameData);
                topicData.endUpdate();

                gamesTopic.publishMessage(gamesTopic.getData()
                    .getLoadMessage());
            }
        }
        catch (APIException ex) {
            logger.info("Exception caught", ex);
        }

        return game;
    }

    /**
     * Add a player to a game.
     *<P>
     * This method is called after addClient(..) and is used to
     * call the addPlayer(..) method for a game, and update the
     * relevant topic data.
     *
     * @param client the client to add
     */
    public void addPlayer(final Client client) {
        final String gameName = getGameName(client);
        final Game game = activeGames.get(gameName);

        game.addPlayer(client);

        final RecordTopicData topicData =
            (RecordTopicData) gamesTopic.getData();

        try {
            final List<Record> gameData = topicData.getState();
            topicData.startUpdate();
            int updateIndex = -1;
            for (int i = 0; i < gameData.size(); ++i) {
                if (gameData.get(i).getField("game").equals(gameName)) {
                    updateIndex = i;
                }
            }

            topicData.update("gameslist", updateIndex, "players",
                game.getPlayers().size());
            topicData.endUpdate();
            gamesTopic.publishMessage(gamesTopic.getData().getLoadMessage());
        }
        catch (APIException ex) {
            logger.info("Caught exception", ex);
        }
    }

    /**
     * Remove a client from the game.
     *<P>
     * This method calls out to the Game associated to the Client,
     * invoking the Game.removePlayer(..) method.
     *
     * @param client the client to remove
     */
    public void removePlayer(final Client client) {
        final String gameName = getGameName(client);
        final Game game = activeGames.get(gameName);

        game.removePlayer(client);

        final RecordTopicData topicData =
            (RecordTopicData) gamesTopic.getData();
        try {
            final List<Record> gameData = topicData.getState();
            topicData.startUpdate();
            int updateIndex = -1;
            for (int i = 0; i < gameData.size(); ++i) {
                if (gameData.get(i).getField("game").equals(gameName)) {
                    updateIndex = i;
                }
            }
            topicData.update("gameslist", updateIndex, "players",
                game.getPlayers().size());
            topicData.endUpdate();
            gamesTopic.publishMessage(gamesTopic.getData().getLoadMessage());
        }
        catch (APIException ex) {
            logger.info("Exception caught", ex);
        }
    }

    private String getGameName(final Client client) {
        final Credentials creds = client.getCredentials();
        if (creds == null || creds.getUsername() == null ||
            "".equals(creds.getUsername())) {
            return "default";
        }
        return creds.getUsername();
    }

    /**
     * Get the Game for a given Client.
     *
     * @param client the client
     * @return the Game
     */
    public Game getGameForClient(final Client client) {
        final String gameName = getGameName(client);
        return activeGames.get(gameName);
    }

    /**
     * Get all of the currently running Games.
     *
     * @return the List of Games
     */
    public List<Game> getAllGames() {
        final List<Game> res = new ArrayList<Game>();
        for (final Game game : activeGames.values()) {
            res.add(game);
        }
        return res;
    }

    /**
     * Remove a Game by name.
     *<P>
     * This method will remove the game from the Map of active games and
     * the topic data.
     *
     * @param gameName the name of the Game to remove.
     */
    public void removeGame(final String gameName) {
        activeGames.remove(gameName);

        // add a record containing the game name, to send to the client
        final RecordTopicData topicData =
            (RecordTopicData) gamesTopic.getData();
        try {
            topicData.startUpdate();
            final List<Record> gameData = topicData.getState();
            for (int i = 0; i < gameData.size(); ++i) {
                if (gameData.get(i).getField("game").equals(gameName)) {
                    gameData.remove(i);
                }
            }
            if (activeGames.size() == 0) {
                final Record rec = new Record(gameRecordMetaData);
                rec.setField("game", "");
                rec.setField("players", 0);
                topicData.update(rec);
            }
            else {
                topicData.update(gameData);
            }
            topicData.endUpdate();
            gamesTopic.publishMessage(gamesTopic.getData().getLoadMessage());
        }
        catch (APIException ex) {
            logger.info("Exception caught", ex);
        }

        gamesTopic.removeTopic(gameName);
    }
}
