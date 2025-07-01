// models.js
const { Model } = require('objection');

class Server extends Model {
    static get tableName() {
        return 'servers';
    }
    static get idColumn() {
        return 'server_id';
    }
}

class World extends Model {
    static get tableName() {
        return 'worlds';
    }
    static get idColumn() {
        return 'world_id';
    }
}

class Player extends Model {
    static get tableName() {
        return 'players';
    }
    static get idColumn() {
        return 'player_id';
    }
}

class PlayerSession extends Model {
    static get tableName() {
        return 'player_sessions';
    }
    static get idColumn() {
        return 'session_id';
    }
}

class Permission extends Model {
    static get tableName() {
        return 'permissions';
    }
    static get idColumn() {
        return 'permission_id';
    }
}

class PlayerPermission extends Model {
    static get tableName() {
        return 'player_permissions';
    }
    static get idColumn() {
        return 'id';
    }
}

class Ban extends Model {
    static get tableName() {
        return 'bans';
    }
    static get idColumn() {
        return 'ban_id';
    }
}

class Plugin extends Model {
    static get tableName() {
        return 'plugins';
    }
    static get idColumn() {
        return 'plugin_id';
    }
}

class Log extends Model {
    static get tableName() {
        return 'logs';
    }
    static get idColumn() {
        return 'log_id';
    }
}

class ServerSetting extends Model {
    static get tableName() {
        return 'server_settings';
    }
    static get idColumn() {
        return 'setting_id';
    }
}

class ChatLog extends Model {
    static get tableName() {
        return 'chat_logs';
    }
    static get idColumn() {
        return 'chat_id';
    }
}

class EconomyTransaction extends Model {
    static get tableName() {
        return 'economy_transactions';
    }
    static get idColumn() {
        return 'transaction_id';
    }
}

module.exports = {
    Server,
    World,
    Player,
    PlayerSession,
    Permission,
    PlayerPermission,
    Ban,
    Plugin,
    Log,
    ServerSetting,
    ChatLog,
    EconomyTransaction
};
