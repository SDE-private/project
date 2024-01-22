import mongoose from 'mongoose';

//----------------------types----------------------------

//typescript interface to represent a MongoDB document type
interface User {
    username: string;
    email: string;
    //songs: string[];
}


//----------------------models----------------------------

//create a schema for the user. A schema is a blueprint for the document
const userSchema = new mongoose.Schema<User>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    //songs: [String]
});

//create a model for the user. A model is a class with which we construct documents
const userModel = mongoose.model<User>('User', userSchema, 'users_collection')


//----------------------events----------------------------

let isConnected = false;

mongoose.connection.on('connected', () => {
    console.log('Connected to the db');
    isConnected = true;
});

//connection open means that the connection is ready to be used
mongoose.connection.on('open', () => {
    console.log('Db ready to be used');
    isConnected = true;
}); 

mongoose.connection.on('reconnected', () => {
    console.log('Reconnected to the db');
    isConnected = true;
});

mongoose.connection.on('disconnecting', () => {
    console.log('Disconnecting from the db');
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from the db');
    isConnected = false;
});

mongoose.connection.on('close', () => {
    console.log('Connection to the db closed');
    isConnected = false;
});

//----------------------functions----------------------------

export async function connectToDatabase() {

    if(isConnected) {
        console.log("New connection avoided: already connected to the db");
        return true;
    }

    try{
        await mongoose.connect('mongodb://mongodb:27017/users');
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
        const userExists = await userModel.exists({username: newUser.username});
        if(userExists) {
            console.log("Cannot add user: username already taken");
            return false;
        }

        await newUser.save();
        console.log("user "+ newUser.username +" successfully added");
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

//-----------

//----------------------exports----------------------------

export { userModel, User };