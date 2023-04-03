import { Schema, model } from "mongoose";

export interface IMember {
  user_id: string;
  card: {
    background_url: string;
    color: string;
    description: string;
    title: string;
  };
  levels: {
    guild_id: string;
    level: number;
    xp: number;
    needed_xp: number;
  }[];
}

const schema = new Schema<IMember>({
  user_id: String,
  card: {
    background_url: String,
    color: String,
    description: String,
    title: String,
  },
  levels: [{
    guild_id: String,
    level: Number,
    xp: Number,
    needed_xp: Number,
  }]
});

export default model<IMember>("members", schema);
