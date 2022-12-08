// Helper functions to be used in other files
const { ObjectId } = require("mongodb");

// VALIDATION FUNCTIONS

/**
 * 
 * @param {*} id 
 * @param {*} varName 
 * @returns 
 */
const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
  return id;
}

/**
 * 
 * @param {*} input 
 */
const checkNames = (input) => {
  var namesCheck = /[a-zA-Z]+/; //checks for letters only
  if (!namesCheck.test(input))
    throw "Error: names must only contain alphabetical characters!";
}

/**
 * 
 * @param {*} strVal 
 * @param {*} varName 
 * @returns 
 */
const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

/**
 * checks if string meets minimum length requirement
 * @param {*} str : string
 * @param {*} size : minimum size of string
 * @returns boolean
 */
const validString = (str, size = 0) => {
  if (!str) throw 'You must provide a non-empty string';
  if (typeof (str) !== 'string') throw 'You must provide a string';
  if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';
  if (str.trim().length < size) throw `Inputted string must contain at least ${size} non-space characters`;

  return true;
};

/**
 * determines if array arr meets minimum size and is of type type
 * doesn't work for multidimensional arrays
 * @param {*} arr : input array
 * @param {*} size : desired minimum length of array
 * @param {*} type : type of contents, if null type doesn't matter
 * @returns boolean
 */
const validArray = (arr, size = 1, type = null) => {
  if (!arr) throw 'You must provide a non-empty array';
  if (arr.length < size) throw 'Your array must have at least ${size} elements';
  if (type !== null) {
    let allEqual = arr => arr.every(val => typeof (val) === type);
    if (!allEqual) throw `All elements in array must be of type ${type}`;
  }

  return true;
};

/**
 * determines if a string contains spaces, ex: 'a b' -> true
 * @param {*} str : input string
 * @returns boolean: true = has spaces, false = doesn't have spaces
 */
const hasSpace = (str) => {
  if (!str) throw 'You must provide a non-empty string';
  if (typeof (str) !== 'string') throw 'You must provide a string';
  if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';

  str = str.trim();

  return /\s/.test(str);
};

/**
 * returns true if str contains numbers, false if str doesn't contain numbers
 * @param {*} str : string
 * @returns boolean
 */
const hasNumbers = (str) => {
  if (!str) throw 'You must provide a non-empty string';
  if (typeof (str) !== 'string') throw 'You must provide a string';
  if (str.trim().length === 0) throw 'String cannot be empty string or just spaces';

  str = str.trim();

  return /\d/.test(str);
};

/**
 * gets todays date and returns it in form mm/dd/yyyy, is only for C.E. dates
 */
let getToday = () => {
  let today = new Date;
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();


  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (yyyy < 10) {
    yyyy = "000" + yyyy;
  } else if (yyyy < 100) {
    yyyy = "00" + yyyy;
  } else if (yyyy < 1000) {
    yyyy = "0" + yyyy;
  }

  today = mm + '/' + dd + '/' + yyyy;
  return today;
};

/*
        username --> 5 characters, non-empty, no spaces, alphanumeric, no special characters
        password --> 6 characters, non-empty, no spaces, 1 capital letter, lowercase, uppercase, and special character
    */
const checkUsername = (username) => {
  //check for existence of arguments
  if ((!username)) {
    throw "must provide both a username and password";
  }

  if (typeof username !== "string") {
    throw "username and password must be strings";
  }

  //check username for letters and numbers only 
  let unRegex = /^[a-zA-Z0-9]+$/;
  let verify = true;

  if (username.trim().match(unRegex) === null) {
    verify = false;
  }

  if (verify === false) {
    throw "username must be letters only";
  }

  //check username be at least 4 characters
  if (username.trim().length < 4) {
    throw "username must be at least 4 characters"
  }

  return username;

};

const checkPassword = (password) => {
  //check password for any character
  let pwRegex = /^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/gm

  if (password.trim().match(pwRegex) === null) {
    verify = false;
  }

  if (verify === false) {
    throw "password must have at least 1 uppercase letter, 1 number, and 1 special character";
  }

  //check password is at least 6 characters
  if (password.trim().length < 6) {
    throw "password must be at least 6 characters"
  }

  return password;
};

module.exports = {
  checkId,
  checkNames,
  checkString,
  checkUsername,
  checkPassword,
  validString,
  validArray,
  hasSpace,
  hasNumbers,
  getToday,
};
