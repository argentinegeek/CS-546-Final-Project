// test
const connection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const songs = data.songs;
const comments = data.comments;

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    // * users
    const user1 = await users.createUser("Mya", "Phu", "mxfu", "KevinsucksD32!", "KevinsucksD32!");
    let parseUser1 = user1["_id"].toString();
    await users.createAdmin(parseUser1);

    const user2 = await users.createUser("Serena", "Lee", "cargi", "Meow123!", "Meow123!");
    let parseUser2 = user2["_id"].toString();
    await users.createAdmin(parseUser2);

    const user3 = await users.createUser("AAAA", "AAAA", "aaaa", "KevinsucksD32!", "KevinsucksD32!");
    let parseUser3 = user3["_id"].toString();

    const user4 = await users.createUser("BBBB", "BBBB", "bbbb", "Meow123!", "Meow123!");
    let parseUser4 = user4["_id"].toString();
    
    // * songs
    // made by user 1
    let song1 = await songs.postSong(parseUser1, "Ghost", "Justin Bieber", ["Pop", "Rap"], [["Youtube", "https://www.youtube.com/watch?v=p6U7zIY6zkA"]]);
    let song2 = await songs.postSong();
    let song3 = await songs.postSong();
    let song4 = await songs.postSong();
    let song5 = await songs.postSong();
    // made by user 2
    let song6 = await songs.postSong();
    let song7 = await songs.postSong();
    let song8 = await songs.postSong();
    let song9 = await songs.postSong();
    let song10 = await songs.postSong();
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

    // * comments
    // song1
    let s1c1 = null;
    let s1c2 = null;
    let parseS1c1 = s1c1["_id"].toString();
    let parseS1c2 = s1c2["_id"].toString();
    // song2
    let s2c1 = null;
    let s2c2 = null;
    let parseS2c1 = s2c1["_id"].toString();
    let parseS2c2 = s2c2["_id"].toString();
    // song3
    let s3c1 = null;
    let s3c2 = null;
    let parseS3c1 = s3c1["_id"].toString();
    let parseS3c2 = s3c2["_id"].toString();
    // song4
    let s4c1 = null;
    let s4c2 = null;
    let parseS4c1 = s4c1["_id"].toString();
    let parseS4c2 = s4c2["_id"].toString();
    // song5
    let s5c1 = null;
    let s5c2 = null;
    let parseS5c1 = s5c1["_id"].toString();
    let parseS5c2 = s5c2["_id"].toString();
    // song6
    let s6c1 = null;
    let s6c2 = null;
    let parseS6c1 = s6c1["_id"].toString();
    let parseS6c2 = s6c2["_id"].toString();
    // song7
    let s7c1 = null;
    let s7c2 = null;
    let parseS7c1 = s7c1["_id"].toString();
    let parseS7c2 = s7c2["_id"].toString();
    // song8
    let s8c1 = null;
    let s8c2 = null;
    let parseS8c1 = s8c1["_id"].toString();
    let parseS8c2 = s8c2["_id"].toString();
    // song9
    let s9c1 = null;
    let s9c2 = null;
    let parseS9c1 = s9c1["_id"].toString();
    let parseS9c2 = s9c2["_id"].toString();
    // song10
    let s10c1 = null;
    let s10c2 = null;
    let parseS10c1 = s10c1["_id"].toString();
    let parseS10c2 = s10c2["_id"].toString();

    // * user interactions


    // * TESTING SONG FUNCTIONS
    // deleteSong()
    

    // getAllSongs()
    
    
    // updateAll()
    
    
    // updateSong()
    
    
    // updateSongTitle()
    
    
    // updateArtist()
    
    
    // updateGenre()
    
    
    // updateSongLinks()
    
    
    // searchSongs()
    
    
    // searchGenres()
    
    
    // searchArtist()
    
    
    // filterByRating()
    
    
    // sortSongs()
    
    // recommendedSongs()
    
    
    // mostPopularArtists()


};

main();