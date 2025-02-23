import { Model } from "objection";

class User extends Model {
    static get tableName() {
        return "users"; // نام دقیق جدول در دیتابیس
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["username", "password"],
            properties: {
                id: { type: "integer", autoIncrement: true },
                username: { type: "string", minLength: 3, maxLength: 255 },
                password: { type: "string", minLength: 6 },
                created_at: { type: "string"},
                updated_at: { type: "string"},
            },
        };
    }
}

export default User;
