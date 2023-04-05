import Creator from "../../utils/creator";

/**
 * Was supposed to handle music, but realized that I can make a global object to handle it.
 */
Creator.Monitor({
  name: "music_player",
  invoke: async () => {
    // doesn't have anything in it.
  },
});
