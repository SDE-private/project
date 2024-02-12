import mongoose from "mongoose";

//----------------------types----------------------------

interface Song {
  id: string;
  title: string;
  upload_timestamp: number;
  yt_url: string;
  analyzed: boolean;
  // song: BinaryData;
}

//typescript interface to represent a MongoDB document type
interface User {
  username: string;
  email: string;
  songs: Song[];
}

//----------------------schemas and models----------------------------

//create a schema for the song. A schema is a blueprint for the document
const songSchema = new mongoose.Schema<Song>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  upload_timestamp: { type: Number, required: true },
  yt_url: { type: String, required: true },
  analyzed: { type: Boolean, default: false, required: false },
  // song: {type: Buffer, required: true}
});

//create a schema for the user. A schema is a blueprint for the document
const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  songs: [songSchema],
});

//create a model for the user. A model is a class with which we construct documents
const userModel = mongoose.model<User>("User", userSchema, "users_collection");

//----------------------events----------------------------

let isConnected = false;

mongoose.connection.on("connected", () => {
  console.log("Connected to the db");
  isConnected = true;
});

//connection open means that the connection is ready to be used
mongoose.connection.on("open", () => {
  console.log("Db ready to be used");
  isConnected = true;
});

mongoose.connection.on("reconnected", () => {
  console.log("Reconnected to the db");
  isConnected = true;
});

mongoose.connection.on("disconnecting", () => {
  console.log("Disconnecting from the db");
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from the db");
  isConnected = false;
});

mongoose.connection.on("close", () => {
  console.log("Connection to the db closed");
  isConnected = false;
});

//----------------------functions----------------------------

export async function connectToDatabase() {
  if (isConnected) {
    console.log("New connection avoided: already connected to the db");
    return true;
  }

  try {
    await mongoose.connect("mongodb://mongodb:27017/users");
    //TODO: L'AUTENTICAZIONE NON FUNZIONA
    //await connect('mongodb://root:password@mongodb:27017/prova');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//-----------

export async function createUser(user: User) {
  if (!isConnected) {
    console.log("No connection to the db... impossible to add user");
    return false;
  }

  try {
    const newUser = new userModel(user);

    //check if user already exists
    const userExists = await userModel.exists({ username: newUser.username });
    if (userExists) {
      console.log("Cannot add user: username already taken");
      return false;
    }

    await newUser.save();
    console.log("user " + newUser.username + " successfully added");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//-----------

export async function addSong(username: string, song: Song) {
  if (!isConnected) {
    console.log("No connection to the db... impossible to add song");
    return false;
  }

  try {
    //check if user already exists
    const userExists = await userModel.exists({ username: username });
    if (!userExists) {
      console.log("Cannot add song: user does not exist");
      return false;
    }
    const songAlreadyLinked = await userModel.exists({
      username: username,
      songs: { $elemMatch: { id: song.id } },
    });
    if (songAlreadyLinked) {
      console.log("Cannot add song: song already linked to the user");
      return false;
    }

    await userModel.updateOne(
      { username: username },
      { $push: { songs: song } },
    );

    console.log(
      "Song " + song.title + " successfully added to user " + username,
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

//-----------

export async function getUser(username: string) {
  if (!isConnected) {
    console.log("No connection to the db... impossible to get user");
    return null;
  }

  try {
    const user: User | null = await userModel.findOne({ username: username });
    if (!user) {
      console.log("Cannot get user: user does not exist");
      return null;
    } else {
      console.log("User " + username + " successfully retrieved");
      return user;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

//----------------------exports----------------------------

export { userModel, User, Song };
