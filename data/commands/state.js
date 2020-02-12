const axios = require('axios');
const moment = require('moment');
const Discord = require('discord.js');

const HASS_URL = process.env.HASS_URL;
const HASS_TOKEN = process.env.HASSIO_TOKEN;
const NAMED_ENTITIES = global.NAMED_ENTITIES;

async function getEntityState(entity_id) {
    return await axios.get(HASS_URL + '/states/' + entity_id, {
        headers: {
            Authorization: 'Bearer ' + HASS_TOKEN,
        },
    })
        .then((res) => {
            let data = res.data;
            return {
                error: false,
                entity: data,
            };
        })
        .catch((err) => {
            if (err.response.status === 404) {
                return {
                    error: true,
                    message: 'Entity \'' + entity_id + '\' not found.',
                };
            }

            return {
                error: true,
                message: 'An unexpected error occurred.',
            };
        });
}

module.exports = {
    name: 'state',
    description: 'Return state of entity',
    async execute (msg, args) {
        msg.reply('One moment, retrieving that for you...');

        let root = args.shift();
        if (root === undefined) {
            msg.reply('not implemented: all states');
            return;
        }

        let entityId;
        let entityName = root;

        if (root in NAMED_ENTITIES) {
            entityId = NAMED_ENTITIES[root].entity;
            entityName = NAMED_ENTITIES[root].name;
        } else {
            entityId = root;
        }

        let entityState = await getEntityState(entityId);
        if (entityState.error === true) {
            msg.reply(entityState.message);
            return;
        }

        let embed = new Discord.RichEmbed();
        embed.setColor('#6cff7f');
        embed.setTitle(entityName);
        embed.addField('Last Status', entityState.entity.state);
        embed.addField('When', moment(entityState.entity.last_changed).fromNow());

        msg.channel.send(embed);
    }
};