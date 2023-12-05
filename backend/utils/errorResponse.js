module.exports = {
  contentTypeError: () => {
    return [400, "Content Type is not Correct"];
  },

  emptyInput: () => {
    return [400, "Input Field should not be Empty"];
  },

  invalidEmailFormat: () => {
    return [400, "Invalid Email Format"];
  },

  invalidNameFormat: () => {
    return [400, 'Invalid Name Format'];
  },

  invalidPasswordFormat: () => {
    return [400, "Invalid Password Format"];
  },

  incorrectPassword: () => {
    return [400, "Incorrect Password"];
  },

  jsonParseError: ()=> {
    return [400, "JSON Parse Error"];
  },

  emailNotFound: () => {
    return [403, "Signin Failed - Email not Found"];
  },

  emailExist: () => {
    return [409, "Email Already Existed"];
  },

  userNotFound: () => {
    return [403, "Signin Failed - User not Found"];
  },

  bodyMissing: () => {
    return [400, "Body Missing"];
  },

  keywordMissing: () => {
    return [400, "Keyword Missing"];
  },

  idMissing: () => {
    return [400, "Id Missing"];
  },

  classIdMissing: () => {
    return [400, "Class Id Missing"];
  },

  examIdMissing: () => {
    return [400, "Exam Id Missing"];
  },

  exerciseIdMissing: () => {
    return [400, "Exercise Id Missing"];
  },

  tokenMissing: () => {
    return [401, "Token Missing"];
  },

  tokenNotFound: () => {
    return [401, "Token Not Found"];
  },

  tokenInvalid: () => {
    return [403, "Token Invalid"];
  },

  imageMissing: () => {
    return [400, "Image Missing"];
  },

  imageSizeError: () => {
    return [400, "Image Size Error"];
  },
  
  notYourExercise: () => {
    return [403, "Not Your Exercise"];
  },
  
  queryNotFound: () => {
    return [404, "Query Not Found"];
  },

  noThingToUpdate: () => {
    return [400, "No Thing To Update"];
  },

  queryFailed: () => {
    return [500, 'Server Error - Query Failed'];
  },


  dbConnectFailed: () => {
    return [500, 'Server Error - Connecting to db Failed'];
  },
};
