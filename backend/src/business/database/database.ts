import { Schema, model, connect } from 'mongoose';

//typescript interface to represent a MongoDB document type
interface User {
    username: string;
    email: string;
    //songs: string[];
}

//create a schema for the user. A schema is a blueprint for the document
const userSchema = new Schema<User>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    //songs: [String]
});

//create a model for the user. A model is a class with which we construct documents
const userModel = model<User>('User', userSchema, 'users_collection')

export async function connectToDatabase() {
    let a = "";
    try{
        await connect('mongodb://mongodb:27017/users');
        //TODO: L'AUTENTICAZIONE NON FUNZIONA
        //await connect('mongodb://root:password@mongodb:27017/prova');
        console.log("connessione al db avvenuta");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function createUser(user: User) {
    //TODO: non mi lascia introdurre un utente se la connessione non è autenticata
    try {
        const newUser = new userModel(user);
        await newUser.save();
        console.log("utente aggiunto");
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

export { userModel, User };