## Discord Bot for HassIO

**What is it?** It's a bot for [Discord Servers](https://discordapp.com/). The bot is able to control
your Home Assistant entities and report states.

**What can it do?** The bot is equipped with the following features:
* [x] Report entity state
* [ ] Control entities (later version)
* [x] Report events
* [x] Hook into automations

### Discord Setup

First, you must create a Discord integration (called an "application") to allow your bot to interface
with your Discord server.

1. Visit the [Discord Developer Portal](https://discordapp.com/developers/applications)
2. Create a `New Application`, give it any name you'd like
3. In the application settings screen, select `OAuth2` from the side-nav
4. Check the box next to `Bot` in the `Scopes` field. Copy the link this has generated into your
browser, and authenticate the bot to your desired server. At this point you will see the bot user
join your server.
5. Now, select `Bot` from the sidebar
6. Click `Add Bot` (`Yes do it`)
7. Copy the `Token` from the `Bot` settings screen. Save this token.

Congratulations! You've completed the Discord setup!

### HassIO Setup

Add this repository to your HassIO add-on store:
1. Copy the repository URL (`https://github.com/nwilging/hass-discord-bot`)
2. Login to Home Assistant, select `Hass.io` from the sidebar (or `Supervisor` for
HassIO `version > 0.150.0`)
3. Select `Add-on Store` tab
4. Paste the repository URL into the `Add new repository by URL` input box and click `ADD`
5. Now you may install the add-on.

### Bot Setup

The only configuration needed is the `discord_token`. Once installed, setup your config as follows
(an example should be generated for you):
```json
{
   "discord_token": "<your discord token from the steps above>",
   "named_entities": ["// We will talk about these later!"], 
}
```

Click `Save`. Now the bot is ready to run! Click `Start` to start the service, scroll towards the
bottom of the page and `Refresh` the log to show the startup output. This will be useful for debugging
issues. A successful startup log looks similar to:
```
Starting HassIO Discord Bot...
Loaded 0 named entities.
HTTP Server started
Logged in as test-bot#1234!
```

Congratulations, you've completed the bot setup!

## Available Commands

The bot may be invoked with `!bot`. It will ignore all other messages, all commands should be
prefixed with `!bot`.

#### `state`

The `state` command can be used to report the current state of entities in Home Assistant. It
requires 1 argument, `entity_id`.

**Usage**
```
!bot state light.living_room_light
```

## Named Entities

_Named entities_ allow you to assign aliases to Home Assistant's already confusing (but consistent
and usable!) name generation. The `named_entities` field in the configuration of the add-on is
an array or objects, which define a named entity.

The syntax of a single named entity object is:
```json
{
  "alias": "<desired alias for entity>",
  "name": "<a human-readable name for the entity, as it will display in Discord>",
  "entity": "<the entity's ID from Home Assistant>"
}
```

An example named entity may be:
```json
{
  "alias": "door.front",
  "name": "Front Door",
  "entity": "sensor.front_door_sensor"
}
```

Named entity aliases serve as "variables" to use in commands to the bot. Using the `state` command
and the above example, a command to the bot may look like:
```
!bot state door.front
```

This will be interpreted as:
```
!bot state sensor.front_door_sensor
```

## Home Assistant Events

The bot opens a websocket connection to Home Assistant and subscribes to the following events:
* `discord_bot.message`

You may hook into automations using these events. In the `Actions` section of your automation,
select `Fire event` for `Action type`, add the desired event name to `Event` input, and the respective
configuration for the event to `Service data`.

When an automation is run, Home Assistant will fire the event you've specified in the actions section
of the automation. This event will be picked up by the bot's websocket client and processed accordingly.

#### `discord_bot.message`
Syntax:
```json
{
  "message": "<desired message to be sent>",
  "channel": "<name of channel to send message to, without #>"
}
```
Example:
```json
{
    "message": "The front door is open.",
    "channel": "general"
}
```