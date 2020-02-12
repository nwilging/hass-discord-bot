class EntityLoader {
    constructor(config) {
        this.config = config;
    }

    load() {
        let namedEntitiesRaw = this.config.named_entities || [];
        let namedEntitiesFormatted = {};

        namedEntitiesRaw.forEach((entity) => {
            namedEntitiesFormatted[entity.alias] = {
                name: entity.name,
                entity: entity.entity,
            };
        });

        return namedEntitiesFormatted;
    }
}

module.exports = EntityLoader;