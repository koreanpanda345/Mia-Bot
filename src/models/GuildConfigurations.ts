import { Schema, model } from "mongoose";

export interface IGuildConfiguration {
	//#region Basic Info
	guild_id: string;
	//#endregion

	//#region Modules
	modules: {
		auto_roles: boolean;
		levels: boolean;
		logs: boolean;
		moderation: boolean;
		ranks: boolean;
		verify: boolean;
		welcome: boolean;
	};
	//#endregion

	//#region autoroles
	auto_roles: {
		ids: string[];
	};
	//#endregion

	//#region levels
	levels: {
		blacklist: {
			users: string[];
			roles: string[];
		};
		card: {
			background_url: string;
			color: string;
			accent: string;
			opacity: number;
		};
		ignore: {
			channels: string[];
		};
		notifications: {
			ping: boolean;
			channel: string;
		};
		rate: {
			amount: number;
			timespan: string;
		};
		rewards: {
			enabled: boolean;
			levels: {
				level: number;
				role: string;
			}[];
		};
	};
	//#endregion

	//#region logs
	logs: {
		basic_channel: string;
		moderation_channel: string;
	};
	//#endregion

	//#region moderation
	moderation: {
		mute: {
			role_id: string;
			users: { id: string; roles: string[]}[];
		};
	};
	//#endregion

	//#region ranks
	ranks: {
		ids: string[];
	};
	//#endregion

	//#region verify
	verify: {
		title: string;
		body: string;
		role: string | undefined;
	};
	//#endregion

	//#region welcome
	welcome: {
		channel_id: string;
		title: string;
		body: string;
		image: string;
	};
	//#endregion
}

const schema = new Schema<IGuildConfiguration>({
	//#region Basic Info
	guild_id: { type: String, required: true},
	//#endregion

	//#region Modules
	modules: {
		auto_roles: Boolean,
		levels: Boolean,
		logs: Boolean,
		moderation: Boolean,
		ranks: Boolean,
		verify: Boolean,
		welcome: Boolean,
	},
	//#endregion

	//#region autoroles
	auto_roles: {
		ids: [String],
	},
	//#endregion

	//#region Levels
	levels: {
		blacklist: {
			users: [String],
			roles: [String],
		},
		card: {
			background_url: String,
			color: String,
			accent: String,
			opacity: Number,
		},
		ignore: {
			channels: [String],
		},
		notifications: {
			ping: Boolean,
			channel: String,
		},
		rate: {
			amount: Number,
			timespan: String,
		},
		rewards: {
			enabled: Boolean,
			levels: [{ level: Number, role: String }],
		},
	},
	//#endregion

	//#region Logs
	logs: {
		basic_channel: String,
		moderation_channel: String,
	},
	//#endregion

	//#region Moderation
	moderation: {
		mute: {
			role_id: String,
			users: [{id: String, roles: [String]}],
		},
	},
	//#endregion

	//#region Ranks
	ranks: {
		ids: [String],
	},
	//#endregion

	//#region Verify
	verify: {
		title: String,
		body: String,
		role: String
	},
	//#endregion

	//#region Welcome
	welcome: {
		channel_id: String,
		title: String,
		body: String,
		image: String,
	},
	//#endregion
});

export default model<IGuildConfiguration>("guild_configuration", schema);