// functions for users
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
//const helper = require("../helpers");
const bcrypt = require("bcryptjs");
const saltRounds = 8;
const validation = require('../helpers');

/**
 * @param {*} username : username of the user
 * @param {*} password : password of the user
 * @returns if the user is already in the system or not
 */
const checkUser = async (username, password) => {
  //validation of the username and password
  username = validation.checkUsername(username);
  password = validation.checkPassword(password);

  //user db
  const userCollection = await users();

  //checking for duplicates in the usercollection 
  let found = await userCollection.findOne({
    userName: username.toLowerCase(),
  });
  //checking for duplicates
  if (found) {
    throw "username already used";
  }

  if (!(await bcrypt.compare(password.trim(), found.password))) {
    throw "Either the username or password is invalid";
  }

  return {
    authenticatedUser: true,
    uID: found["_id"].toString(),
  };
};

/**
 *
 * @param {*} firstName : firstname of user entered in the registration page - string
 * @param {*} lastName : lastname of user entered in the registration page - string
 * @param {*} userName : username of user entered in the registration page - string
 * @param {*} Email : Email of user entered in the registration page - string
 * @param {*} password : password of user entered in the registration page - string
 * @param {*} confirmPassword : password of user entered in the registration page - string
 * @param {*} isAdmin : admin flag that all users will have, set to false in this function - boolean
 * @param {*} songPosts : list of songs posted by user - array
 * @param {*} songReviews : list of reviews that a user has posted - array
 * @param {*} playlistPosts : list of playlists the user has posted - array
 * @param {*} commentInteractions : list of ids of the comments the user has interacted with - array
 * @returns new created user
 * TODO remove song Id from song posts function
 * TODO remove comment Id from song reviews
 * TODO Remove a playlistId from playlist post
 * TODO remove a commentInteractionsId from commentInteractions
 */
const createUser = async (
  firstName,
  lastName,
  userName,
  password,
  confirmPassword
) => {
  validation.checkNames(firstName);
  validation.checkNames(lastName);
  validation.checkString(firstName, "string");
  validation.checkString(lastName, "string");
  validation.checkUsername(userName);
  if (!password === confirmPassword)
    throw "Error: password must match confirmPassword";
  const userCollection = await users();
  const hash = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    password: hash,
    isAdmin: false,
    songPosts: [],
    songReviews: [],
    playlistsPosts: [],
    commentInteractions: [],
  };
  const newInsert = await userCollection.insertOne(newUser);
  if (newInsert.insertedCount === 0) throw "Insert failed!";
  return await getUserById(newInsert.insertedId.toString());
};

/**
 * @returns list of users in DB
 */
const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "No users in system!";
  return userList;
};

/**
 * @param {*} id : ObjectId of user being searched - string
 * @returns
 */
const getUserById = async (id) => {
  id = validation.checkId(id, "ID");
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found";
  return user;
};

// same as getUserById but just checks if they're an admin or not
/**
 * @param {*} userId : ObjectId of user being checked - string
 * @returns boolean true if user is admin, false if not
 */
const isAdmin = async (userId) => {
  userId = validation.checkId(userId, "ID");
  const user = await getUserById(userId);
  if (user.isAdmin === false) return false; //not admin return false
  else return true; // admin return true
};

/**
 * @param {*} userId : ObjectId of user being processed for admin privileges - string
 */
const createAdmin = async (userId) => {
  userId = validation.checkId(userId, "ID");
  const user = await getUserById(userId);
  //need to errorcheck if user exists
  if (isAdmin(userId) === true) throw "User is already an admin!";

  const userCollection = await users();

  const update = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: { isAdmin: true } }
  );

  //need to error check
  return true;
};



module.exports = {
  createUser,
  checkUser,
  getAllUsers,
  getUserById,
  isAdmin,
  createAdmin,
};
