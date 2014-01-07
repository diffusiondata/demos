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

import com.pushtechnology.diffusion.api.publisher.Client;
import com.pushtechnology.diffusion.api.publisher.DefaultClientListener;

/**
 * ConwayClientListener
 *<P>
 * This class provides a listener to client interactions with the Publisher.
 * Only clientClosed is implemented.
 *
 * @author tmclaughlan
 */
public class ConwayClientListener extends DefaultClientListener {

    private final ConwayPublisher thePublisher;

    /**
     * Constructor.
     * @param publisher the Publisher to listen to
     */
    public ConwayClientListener(final ConwayPublisher publisher) {
        thePublisher = publisher;
    }

    /*
     * A client has disconnected, so remove their player from the game. We'll
     * also publish a message to all remaining clients to inform them.
     */
    @Override
    public void clientClosed(final Client client) {
        thePublisher.removePlayer(client);
    }

}
