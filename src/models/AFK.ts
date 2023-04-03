import { Schema, model } from "mongoose";

export interface IAFK {
	user_id: string;
	guild_id: string;
	messages: {
		author_id: string;
		message: string;
		timestamp: string;
	}[];
}

const schema = new Schema<IAFK>({
	user_id: String,
	guild_id: String,
	messages: [{
		author_id: String,
		message: String,
		timestamp: String,
	}],
});

export default model<IAFK>("afk", schema);