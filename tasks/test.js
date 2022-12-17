// test
const connection = require("../config/mongoConnection");
const { ObjectId } = require("mongodb");
const data = require("../data");
const { getAllSongs, updateSong } = require("../data/songs");
const users = data.users;
const songs = data.songs;
const comments = data.comments;
const playlists = data.playlists;

const main = async () => {
  const db = await connection.dbConnection();
  await db.dropDatabase();

  // * users
  console.log("MAKING USERS");
  const user1 = await users.createUser(
    "Mya",
    "Phu",
    "mxfu",
    "KevinsucksD32!",
    "KevinsucksD32!"
  );
  let parseUser1 = user1["_id"].toString();
  await users.createAdmin(parseUser1);

  const user2 = await users.createUser(
    "Serena",
    "Lee",
    "cargi",
    "Meow123!",
    "Meow123!"
  );
  let parseUser2 = user2["_id"].toString();
  await users.createAdmin(parseUser2);

  const user3 = await users.createUser(
    "AAAA",
    "AAAA",
    "aaaa",
    "KevinsucksD32!",
    "KevinsucksD32!"
  );
  let parseUser3 = user3["_id"].toString();

  const user4 = await users.createUser(
    "BBBB",
    "BBBB",
    "bbbb",
    "Meow123!",
    "Meow123!"
  );
  let parseUser4 = user4["_id"].toString();

  // * songs
  console.log("MAKING SONGS");
  // made by user 1
  let song1 = await songs.postSong(
    parseUser1,
    "Ghost",
    "Justin Bieber",
    ["Pop", "Rap"],
    [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]]
  );
  let song2 = await songs.postSong(
    parseUser1,
    "All I Want for Christmans Is You",
    "Mariah Carey",
    ["Pop", "Christmas"],
    [
      [
        "Spotify",
        "https://open.spotify.com/track/0bYg9bo50gSsH3LtXe2SQn?si=14779c5fc14f4f23",
      ],
    ]
  );
  let song3 = await songs.postSong(
    parseUser1,
    "Kill Bill",
    "SZA",
    ["R&B"],
    [
      ["Youtube", "https://youtu.be/61ymOWwOwuk"],
      [
        "Spotify",
        "https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO?si=ec675d4488a64d13",
      ],
    ]
  );
  let song4 = await songs.postSong(
    parseUser1,
    "Me Porto Bonito",
    "Bad Bunny",
    ["Regaeton", "Latin Pop", "Pop"],
    [
      ["Youtube", "https://youtu.be/SQnc1QibapQ"],
      [
        "Spotify",
        "https://open.spotify.com/track/1Qrg8KqiBpW07V7PNxwwwL?si=ab67351382194aa0",
      ],
    ]
  );
  let song5 = await songs.postSong(
    parseUser1,
    "Bad Habit",
    "Steve Lacy",
    ["R&B", "Alternative R&B"],
    [
      ["Youtube", "https://youtu.be/VF-FGf_ZZiI"],
      [
        "Spotify",
        "https://open.spotify.com/track/4k6Uh1HXdhtusDW5y8Gbvy?si=72d31a366f8e4a70",
      ],
    ]
  );
  // made by user 2
  let song6 = await songs.postSong(
    parseUser2,
    "Holly Jolly Christmas",
    "Michael Buble",
    ["Christmas"],
    [
      ["Youtube", "https://youtu.be/Dkq3LD-4pmM"],
      [
        "Spotify",
        "https://open.spotify.com/track/6tjituizSxwSmBB5vtgHZE?si=84e5c0c1423347a2",
      ],
    ]
  );
  let song7 = await songs.postSong(
    parseUser2,
    "Glimpse of Us",
    "Joji",
    ["R&B"],
    [
      ["Youtube", "https://youtu.be/NgsWGfUlwJI"],
      [
        "Spotify",
        "https://open.spotify.com/track/4ewazQLXFTDC8XvCbhvtXs?si=2890b48175514471",
      ],
    ]
  );
  let song8 = await songs.postSong(
    parseUser2,
    "Blue in Green",
    "Miles Davis",
    ["Jazz"],
    [
      ["Youtube", "https://youtu.be/TLDflhhdPCg"],
      [
        "Spotify",
        "https://open.spotify.com/track/0aWMVrwxPNYkKmFthzmpRi?si=a60071f9e3714f6e",
      ],
    ]
  );
  let song9 = await songs.postSong(
    parseUser2,
    "Midnight Rain",
    "Taylor Swift",
    ["Pop"],
    [
      ["Youtube", "https://youtu.be/Odh9ddPUkEY"],
      [
        "Spotify",
        "https://open.spotify.com/track/3rWDp9tBPQR9z6U5YyRSK4?si=9a801a5a3d1643ad",
      ],
    ]
  );
  let song10 = await songs.postSong(
    parseUser2,
    "Never Gonna Give You Up",
    "Rick Astley",
    ["Pop"],
    [
      ["Youtube", "https://youtu.be/dQw4w9WgXcQ"],
      [
        "Spotify",
        "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=832bcda624d84bd1",
      ],
    ]
  );
  // parse songs
  let ps1 = song1["_id"].toString();
  let ps2 = song2["_id"].toString();
  let ps3 = song3["_id"].toString();
  let ps4 = song4["_id"].toString();
  let ps5 = song5["_id"].toString();
  let ps6 = song6["_id"].toString();
  let ps7 = song7["_id"].toString();
  let ps8 = song8["_id"].toString();
  let ps9 = song9["_id"].toString();
  let ps10 = song10["_id"].toString();

  //making playlists
  console.log("MAKING PLAYLISTS");
  let playlist1 = await playlists.createPlaylist(
    parseUser1,
    "Music",
    "My playlist with my music",
    [song1.title, song2.title, song3.title, song4.title]
  );
  let playlist2 = await playlists.createPlaylist(
    parseUser1,
    "My favorite songs",
    "My playlist with my favorite songs",
    [song5.title, song8.title, song9.title, song4.title]
  );
  let playlist3 = await playlists.createPlaylist(
    parseUser2,
    "I hate these eongs",
    "My playlist music I don't like",
    [song4.title, song6.title, song7.title, song9.title]
  );
  let playlist4 = await playlists.createPlaylist(
    parseUser2,
    "Summer Jams",
    "Music that reminds me of summer",
    [song6.title, song10.title, song7.title, song3.title]
  );
  //parsed playlists
  let parsePl1 = playlist1["_id"].toString();
  let parsePl2 = playlist2["_id"].toString();
  let parsePl3 = playlist3["_id"].toString();
  let parlsePl4 = playlist4["_id"].toString();

  // * comments
  console.log("MAKING COMMENTS");
  // song1
  let s1c1 = await comments.createComment(
    ps1,
    parseUser1,
    "I love this song",
    5
  );
  let s1c2 = await comments.createComment(ps1, parseUser3, "Its ok", 3);
  let parseS1c1 = s1c1["_id"].toString();
  let parseS1c2 = s1c2["_id"].toString();
  // song2
  let s2c1 = await comments.createComment(ps2, parseUser2, "noooooo", 2);
  let s2c2 = await comments.createComment(ps2, parseUser4, "so happy", 5);
  let parseS2c1 = s2c1["_id"].toString();
  let parseS2c2 = s2c2["_id"].toString();
  // song3
  let s3c1 = await comments.createComment(ps3, parseUser1, ";lasjfoishg", 4);
  let s3c2 = await comments.createComment(ps3, parseUser2, " tkjienfsa ddd", 1);
  let parseS3c1 = s3c1["_id"].toString();
  let parseS3c2 = s3c2["_id"].toString();
  // song4
  let s4c1 = await comments.createComment(ps4, parseUser3, "fire", 4);
  let s4c2 = await comments.createComment(
    ps4,
    parseUser4,
    "very fun, not well written",
    2
  );
  let parseS4c1 = s4c1["_id"].toString();
  let parseS4c2 = s4c2["_id"].toString();
  // song5
  let s5c1 = await comments.createComment(ps5, parseUser1, "i'm crying", 5);
  let s5c2 = await comments.createComment(ps5, parseUser4, "meh", 1);
  let parseS5c1 = s5c1["_id"].toString();
  let parseS5c2 = s5c2["_id"].toString();
  // song6
  let s6c1 = await comments.createComment(ps6, parseUser2, "so happy", 4);
  let s6c2 = await comments.createComment(
    ps6,
    parseUser3,
    "the original was better",
    1
  );
  let parseS6c1 = s6c1["_id"].toString();
  let parseS6c2 = s6c2["_id"].toString();
  // song7
  let s7c1 = await comments.createComment(ps7, parseUser1, "too sad", 5);
  let s7c2 = await comments.createComment(ps7, parseUser3, "not for me", 2);
  let parseS7c1 = s7c1["_id"].toString();
  let parseS7c2 = s7c2["_id"].toString();
  // song8
  let s8c1 = await comments.createComment(ps8, parseUser2, "smooth", 4);
  let s8c2 = await comments.createComment(
    ps8,
    parseUser4,
    "they don't make music like this anymore",
    5
  );
  let parseS8c1 = s8c1["_id"].toString();
  let parseS8c2 = s8c2["_id"].toString();
  // song9
  let s9c1 = await comments.createComment(ps9, parseUser1, "yesssss", 5);
  let s9c2 = await comments.createComment(
    ps9,
    parseUser2,
    "amazing!!!!!!!!!!!!!!!!!!!!!",
    5
  );
  let parseS9c1 = s9c1["_id"].toString();
  let parseS9c2 = s9c2["_id"].toString();
  // song10
  let s10c1 = await comments.createComment(
    ps10,
    parseUser3,
    "Life changing",
    5
  );
  let s10c2 = await comments.createComment(ps10, parseUser4, "classic", 5);
  let parseS10c1 = s10c1["_id"].toString();
  let parseS10c2 = s10c2["_id"].toString();

  // * user interactions
  console.log("MAKING USER INTERACTIONS");
  let userInteraction1 = await comments.createUserInteraction(
    parseS1c1,
    parseUser3,
    ps1,
    true
  );
  let userInteraction2 = await comments.createUserInteraction(
    parseS3c2,
    parseUser4,
    ps3,
    false
  );
  let userInteraction3 = await comments.createUserInteraction(
    parseS8c1,
    parseUser3,
    ps8,
    true
  );
  let userInteraction4 = await comments.createUserInteraction(
    parseS8c2,
    parseUser3,
    ps8,
    true
  );
  let userInteraction5 = await comments.createUserInteraction(
    parseS1c1,
    parseUser4,
    ps1,
    false
  );

  let parsedInteraction1 = userInteraction1["_id"].toString();
  let parsedInteraction2 = userInteraction2["_id"].toString();
  let parsedInteraction3 = userInteraction3["_id"].toString();
  let parsedInteraction4 = userInteraction4["_id"].toString();
  let parsedInteraction5 = userInteraction5["_id"].toString();

  //   * playlists
  //     //   updateAllPlaylist
  //     try {
  //       let test = await playlists.updateAllPlaylist(
  //         parsePl1,
  //         parseUser1,
  //         "New songs",
  //         "New songs are in my playlist",
  //         [song6.title, song10.title, song7.title, song3.title]
  //       );
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   updatePlaylist
  //     try {
  //       let test = await playlists.updatePlaylist(parseUser1, parsePl2, {
  //         name: "Bad songs",
  //         description: "New songs are in my playlist that I don't like",
  //         songs: [song6.title, song10.title, song7.title, song3.title],
  //       });
  //       console.log(test);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //deletePlaylist
  try {
    let test = await playlists.deletePlaylist(parseUser2, parlsePl4);
    console.log(test);
  } catch (e) {
    console.log(e);
  }

  // * Testing functions only output messages when there is an undesirable output
  // // ! TESTING USER FUNCTIONS
  // console.log('!-----TESTING USER FUNCTIONS-----!');

  // ! TESTING SONG FUNCTIONS
  // console.log('!-----TESTING SONG FUNCTIONS-----!');
  // // postSong()
  // console.log('----postSong() test----');
  // // invalid inputs
  // try { // missing inputs
  //     let test = await songs.postSong();
  //     console.log(`1 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try { // wrong types
  //     let test = await songs.postSong(user1, "x", "x", [5, "test"], ['test']);
  //     console.log(`2 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try { // not admin
  //     let test = await songs.postSong(user2, 'x', 'x', ['x'], [['Youtube', 'x']]);
  //     console.log(`3 failed invalid input case: ${test}`);
  // } catch (e) {}

  // // deleteSong()
  // console.log('----deleteSong() test----');
  // try {
  //     let test = await songs.deleteSong();
  //     console.log(`1 invalid input test case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.deleteSong(1, parseUser1);
  //     console.log(`2 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.deleteSong(ps1, parseUser3);
  //     console.log(`failed not admin case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.deleteSong(ObjectId(), parseUser1);
  //     console.log(`failed song doesn't exist case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.deleteSong(ps1, parseUser2);
  //     // console.log(test);
  //     // console.log(await users.getUserById(parseUser1));
  //     // console.log(await users.getUserById(parseUser3));
  //     // console.log(await users.getUserById(parseUser4));
  //     // song1 = await songs.postSong(parseUser1, "Ghost", "Justin Bieber", ["Pop", "Rap"], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]]);
  //     // ps1 = song1["_id"].toString();
  //     // s1c1 = await comments.createComment(ps1, parseUser1, "I love this song", 5);
  //     // s1c2 = await comments.createComment(ps1, parseUser3, "Its ok", 3);
  //     // parseS1c1 = s1c1["_id"].toString();
  //     // parseS1c2 = s1c2["_id"].toString();
  // } catch (e) {
  //     console.log(`failed to delete when not poster but admin: ${e}`);
  // }
  // try {
  //     let test = await songs.deleteSong(ps6, parseUser2);
  //     console.log(test);
  //     // song6 = await songs.postSong(parseUser2, "Holly Jolly Christmas", "Michael Buble", ["Christmas"], [["Youtube", "https://youtu.be/Dkq3LD-4pmM"], ["Spotify", "https://open.spotify.com/track/6tjituizSxwSmBB5vtgHZE?si=84e5c0c1423347a2"]]);
  //     // ps6 = song6["_id"].toString();
  //     // s6c1 = await comments.createComment(ps1, parseUser2, "so happy", 4);
  //     // s6c2 = await comments.createComment(ps1, parseUser3, "the original was better", 1);
  //     // parseS6c1 = s6c1["_id"].toString();
  //     // parseS6c2 = s6c2["_id"].toString();
  // } catch (e) {
  //     console.log(`failed to delete when poster and admin: ${e}`);
  // }

  // // getAllSongs()
  // console.log('----getAllSongs() test----');
  // try {
  //     let test = await songs.getAllSongs();
  // } catch (e) {
  //     console.log(`failed to get all songs: ${e}`)
  // }

  // // updateAll()
  // console.log('----updateAll() test----');
  // try {
  //     let test = await songs.updateAll();
  //     console.log(`failed no input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.updateAll('this is going to fail');
  //     console.log(`1 failed missing input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.updateAll(ps3, parseUser3, 'hahah', 'hahaha', ['kidz bop'], [["Youtube", "https://youtu.be/61ymOWwOwuk"], ["Spotify", "https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO?si=ec675d4488a64d13"]]);
  //     console.log(`failed not admin case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.updateAll(ps3, parseUser2, 'Kill bill', 'sZa', ['kidz bop'], [["Youtube", "https://youtu.be/61ymOWwOwuk"], ["Spotify", "https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO?si=ec675d4488a64d13"]]);
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed update when admin but not poster case: ${e}`);
  // }
  // try {
  //     let test = await songs.updateAll(ps3, parseUser2, 'kill bill', 'SZA', ['R&B', 'sad'], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]]);
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed update when admin and poster case: ${e}`);
  // }

  // // updateSong()
  //   console.log("----updateSong() test----");

  //   // // * WORK OF THESE IS DONE BY updateSong()
  //   // // // updateSongTitle()
  //   // // // updateArtist()
  //   // // // updateGenre()
  //   // // // updateSongLinks()
  //   try {
  //     let test = await updateSong(parseUser1, ps1, { artist: "JB" });
  //   } catch (e) {
  //     console.log(e);
  //   }

  // // searchSongs()
  // console.log('----searchSongs() test----');
  // try {
  //     let test = await songs.searchSongs();
  //     console.log( `1 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.searchSongs('test');
  //     console.log( `2 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.searchSongs('   ');
  //     console.log( `3 failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.searchSongs('kill bill');
  // } catch (e) {
  //     console.log( `1 failed failed to find a match: ${e}`);
  // }
  // try {
  //     let test = await songs.searchSongs('Kill Bill');
  // } catch (e) {
  //     console.log( `2 failed to find a match: ${e}`);
  // }

  // // searchGenres()
  // console.log('----searchGenres() test----');
  // try {
  //     let test = await songs.searchGenres()
  //     console.log(`failed invalid input case: ${test}`);
  // } catch (e) {}

  // // searchArtist()
  // console.log('----searchArtist() test----');
  // try {
  //     let test = await songs.searchArtist();
  //     console.log(`failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.searchArtist('sza');
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed search case: ${e}`);
  // }

  // // filterByRating()
  // console.log('----filterByRating() test----');
  // try {
  //     let test = await songs.filterByRating()
  //     console.log(`failed invalid input case: ${test}`)
  // } catch (e) {}
  // try {
  //     let test = await songs.filterByRating(1)
  //     console.log(`failed invalid input case: ${test}`)
  // } catch (e) {}
  // try {
  //     let test = await songs.filterByRating(5, 1)
  //     console.log(`failed invalid input case: ${test}`)
  // } catch (e) {}
  // try {
  //     let test = await songs.filterByRating(2, 4);
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed filter case: ${e}`)
  // }

  // // sortSongs()
  // console.log('----sortSongs() test----');
  // try {
  //     let test = await songs.sortSongs();
  //     console.log(`failed no input: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.sortSongs(1, 'pie');
  //     console.log(`failed bad first input: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.sortSongs();
  //     console.log(`failed bad second input: ${test}`);
  // } catch (e) {}
  // try {
  //     let test = await songs.sortSongs(-1, 'overallRating')
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed soritng by overallRating: ${e}`)
  // }
  // try {
  //     let test = await songs.sortSongs(1, 'artist')
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed sorting by artist: ${e}`)
  // }
  // try {
  //     let test = await songs.sortSongs(-1, 'title')
  //     // console.log(test);
  // } catch (e) {
  //     console.log(`failed sorting by title: ${e}`);
  // }

  // // recommendedSongs()
  // console.log('----recommendedSongs() test----');
  // try {
  //     let test = await songs.recommendedSongs();
  //     console.log(`failed invalid input case: ${test}`);
  // } catch (e) {}
  // try {
  //     let t1 = await songs.postSong(parseUser1, 'test', 'SZA', ['test'], [['Spotify', 'test']]);
  //     let test = await songs.recommendedSongs(ps3);
  //     // console.log(`recommended songs for song ${song3.title}: ${test}`);
  //     let deleted = await songs.deleteSong(t1._id, parseUser2);
  //     // console.log(deleted);
  // } catch (e) {
  //     console.log(`failed to give recommendations: ${e}`);
  // }

  // // mostPopularArtists()
  // console.log('----mostPopularArtists() test----');
  // try {
  //     let test = await songs.mostPopularArtists();
  //     console.log(test);
  // } catch (e) {
  //     console.log(`failed to get artsits: ${e}`);
  // }

  // // ! TESTING COMMENT FUNCTIONS
  // console.log('!-----TESTING COMMENT FUNCTIONS-----!');

  // // ! TESTING PLAYLIST FUNCTIONS
  // console.log('!-----TESTING PLAYLIST FUNCTIONS-----!');

  await connection.closeConnection();
  console.log("Done!");
};

main();
