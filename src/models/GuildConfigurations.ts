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

});

export default model<IGuildConfiguration>("guild_configuration", schema);