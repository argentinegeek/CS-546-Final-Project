const connection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const songs = data.songs;
const comments = data.comments;
const playlists = data.playlists;

async function main() {
  //first two lines
  const db = await connection.dbConnection();
  await db.dropDatabase();

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
    [
      ["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"],
      [
        "Spotify",
        "https://open.spotify.com/track/6I3mqTwhRpn34SLVafSH7G?si=4a4a221146fc4c60",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/ghost/1556175419?i=1556175854",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/justin-bieber/justice-triple-chucks-deluxe/ghost/TRtxvxzqZhPg949?part=ug-desktop&corr=214880858098631730",
      ],
    ]
  );
  let song2 = await songs.postSong(
    parseUser1,
    "All I Want for Christmans Is You",
    "Mariah Carey",
    ["Pop", "Christmas"],
    [
      ["Youtube", "https://youtu.be/aAkMkVFwAoo"],
      [
        "Spotify",
        "https://open.spotify.com/track/0bYg9bo50gSsH3LtXe2SQn?si=14779c5fc14f4f23",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/all-i-want-for-christmas-is-you/585972750?i=585972803",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/mariahcarey/all-i-want-for-christmas-is-5?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/playlist/PL:1407374969209471:1133813906?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/kill-bill/1657869377?i=1657869393",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/szababy2/kill-bill?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/sza/sos/kill-bill/TRfxz6X6hphprfg?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/me-porto-bonito/1622045624?i=1622045634",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/badbunny15/bad-bunny-chencho-corleone-me?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/bad-bunny-and-chencho-corleone/un-verano-sin-ti/me-porto-bonito/TRP954KlPK7ppw9?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/bad-habit/1631909576?i=1631909584",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/steevlacy/bad-habit?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/steve-lacy/gemini-rights/bad-habit/TR2pzKcg6wbggj4?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/holly-jolly-christmas/669854820?i=669854837",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/michaelbuble/holly-jolly-christmas?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/glimpse-of-us/1640829780?i=1640829782",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/jojiofficial/joji-glimpse-of-us?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/joji/smithereens/glimpse-of-us/TR2kxvP9pKwZ2pX?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/blue-in-green/300865074?i=300865222",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/milesdavissonymusic/blue-in-green-263067290?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/miles-davis/kind-of-blue-legacy-edition/blue-in-green-feat-john-coltrane-and-bill-evans/TRzZtjrctqnvcrm?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/midnight-rain/1645937249?i=1645937261",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/taylorswiftofficial/midnight-rain?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/taylor-swift/midnights-3am-edition/midnight-rain/TRxXmdgmxrV5Kv2?part=ug-desktop&corr=214880858098631730",
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
      [
        "Apple Music",
        "https://music.apple.com/us/album/never-gonna-give-you-up/1558533900?i=1558534271",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/rick-astley-official/never-gonna-give-you-up-4?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/rick-astley/whenever-you-need-somebody-deluxe-edition-2022-remaster/never-gonna-give-you-up-2022-remaster/TRPqk6lxwZqzPwK?part=ug-desktop&corr=214880858098631730",
      ],
    ]
  );
  let song11 = await songs.postSong(
    parseUser1,
    "Anti-Hero",
    "Taylor Swift",
    ["Pop"],
    [
      ["Youtube", "https://youtu.be/b1kbLwvqugk"],
      [
        "Spotify",
        "https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu?si=bda03be607244246",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/anti-hero/1650841512?i=1650841515",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/taylorswiftofficial/anti-hero?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/taylor-swift/anti-hero/AL6zxbvd2tP7vPk?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song12 = await songs.postSong(
    parseUser1,
    "Lift Me Up",
    "Rihanna",
    ["R&B", "Soul"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=Mx_OexsUI2M"],
      [
        "Spotify",
        "https://open.spotify.com/track/35ovElsgyAtQwYPYnZJECg?si=698deec6b7144306",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/lift-me-up-from-black-panther-wakanda-forever-music/1651763191",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/rihanna/lift-me-up-from-black-panther?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/rihanna/lift-me-up-from-black-panther-wakanda-forever-music-from-and-inspired-by/ALt9kqgZbhhnk3w?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song13 = await songs.postSong(
    parseUser1,
    "Golden Hour",
    "JVKE",
    ["Pop", "R&B"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=PEM0Vs8jf1w"],
      [
        "Spotify",
        "https://open.spotify.com/track/4yNk9iz9WVJikRFle3XEvn?si=0ab3bf3d3aec49b8",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/golden-hour/1645425544?i=1645425554",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/itsjvke/golden-hour?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/jvke/golden-hour/AL24w25kxK7gqbc?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song14 = await songs.postSong(
    parseUser1,
    "Just Wanna Rock",
    "Lil Uzi Vert",
    ["Rap"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=q-P27qMJvPg"],
      [
        "Spotify",
        "https://open.spotify.com/track/4FyesJzVpA39hbYvcseO2d?si=9e5e1d8808fe4ed7",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/just-wanna-rock/1650101844?i=1650101845",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/liluzivert/lil-uzi-vert-just-wanna-rock?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/lil-uzi-vert/just-wanna-rock-single-explicit/just-wanna-rock/TRPXbJPJmcgPvn2?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song15 = await songs.postSong(
    parseUser1,
    "Umbrella",
    "Rihanna",
    ["Pop"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=CvBfHwUxHIk"],
      [
        "Spotify",
        "https://open.spotify.com/track/49FYlytm3dAAraYgpoJZux?si=08e14ebc270d4bbc",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/umbrella-feat-jay-z/1441154435?i=1441154437",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/rihanna/umbrella?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/rihanna/good-girl-gone-bad-reloaded/umbrella-feat-jay-z/TRn6bXl5hfh4k9K?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song16 = await songs.postSong(
    parseUser2,
    "La Jumpa",
    "Arcangel",
    ["Latin pop"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=S0_888ZjlAA"],
      [
        "Spotify",
        "https://open.spotify.com/track/5MxFWjuqQIsbNWbMdMdbli?si=4ebf28d017284cd3",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/la-jumpa/1657275761?i=1657276068",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/urban-latino/arcangel-bad-bunny-la-jumpa?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/arcangel-and-bad-bunny/la-jumpa/la-jumpa/TRK9nqx2ttpcz7g?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song17 = await songs.postSong(
    parseUser2,
    "Closer",
    "Nine Inch Nails",
    ["Rock"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=PTFwQP86BRs"],
      [
        "Spotify",
        "https://open.spotify.com/track/2oDqmfa2g8W893LlwJG1qu?si=636d1d409a8842d6",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/closer/1440837096?i=1440837621",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/nineinchnails/closer-album-version?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/9-inch-nails/the-downward-spiral-deluxe-edition-explicit/closer/TRfPd94hJh2bqcg?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song18 = await songs.postSong(
    parseUser2,
    "Hurt",
    "Nine Inch Nails",
    ["Rock"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=Ty-bLdf8Bsw"],
      [
        "Spotify",
        "https://open.spotify.com/track/1lo9k4PrxFd5Np4cAxXoKo?si=ee0762f07af14146",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/hurt/1440837096?i=1440838114",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/nineinchnails/hurt-album-version?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/9-inch-nails/the-downward-spiral-deluxe-edition-explicit/hurt/TRcwP46kKPtjn9k?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song19 = await songs.postSong(
    parseUser2,
    "Hotline Bling",
    "Drake",
    ["Rap", "Rap pop"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=uxpDa-c-4Mc"],
      [
        "Spotify",
        "https://open.spotify.com/track/0wwPcA6wtMf6HUMpIRdeP7?si=e9ff78cfb0f943dc",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/hotline-bling/1440841363?i=1440841730",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/octobersveryown/drake-hotline-bling-1?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/drake/views/hotline-bling/TRzKKlr7l47gXJ9?part=ug-desktop&corr=168613408801817570",
      ],
    ]
  );
  let song20 = await songs.postSong(
    parseUser2,
    "Last Last",
    "Burna Boy",
    ["Rap"],
    [
      ["Youtube", "https://www.youtube.com/watch?v=421w1j87fEM"],
      [
        "Spotify",
        "https://open.spotify.com/track/5YbPxJwPfrj7uswNwoF1pJ?si=970b1f7403d74305",
      ],
      [
        "Apple Music",
        "https://music.apple.com/us/album/last-last/1623677591?i=1623677811",
      ],
      [
        "Soundcloud",
        "https://soundcloud.com/burnaboy/last-last?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
      ],
      [
        "Pandora",
        "https://www.pandora.com/artist/burna-boy/love-damini/last-last/TRbJc3V4vZ9KPKq?part=ug-desktop&corr=168613408801817570",
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
  let ps11 = song11["_id"].toString();
  let ps12 = song12["_id"].toString();
  let ps13 = song13["_id"].toString();
  let ps14 = song14["_id"].toString();
  let ps15 = song15["_id"].toString();
  let ps16 = song16["_id"].toString();
  let ps17 = song17["_id"].toString();
  let ps18 = song18["_id"].toString();
  let ps19 = song19["_id"].toString();
  let ps20 = song20["_id"].toString();

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

  //last two lines
  await connection.closeConnection();
  console.log("Done!");
}

main().catch((error) => {
  console.log(error);
});
