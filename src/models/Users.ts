import { Schema, model } from "mongoose";

export interface IUser {
  //#region Basic Info
  user_id: string;
  //#endregion

  //#region Music
  music: {
    playlist: { name: string; tracks: string[] }[];
  };
  //#endregion
}

const schema = new Schema<IUser>({
  user_id: String,
  music: {
    playlist: [{ name: String, tracks: [String] }],
  },
});

export default model<IUser>("user", schema);
