import { Router } from 'express';
import { userModel, connectToDatabase, createUser } from '../database/database.js';

const router = Router();
export default router;

//respond to GET requests on /db-tests
router.get('/conn', async (req, res) => {

    const connected = await connectToDatabase();
    if (connected) {
        res.send("Connessione avvenuta");
    } else {
        res.status(500).send("Connessione fallita");
    }
});

router.post('/add_user', async (req, res) => {
    console.log("Adding user...")
    const uname : string = req.body.username;
    const mail : string = req.body.email;

    //doesn't matter if already connected.. it will check if it is connected before startign the whole procedure
    await connectToDatabase();

    const created : boolean = await createUser({username: uname, email: mail, songs: []});
    if (created) {
        res.send("New user ("+uname+") successfully added");
    } else {
        res.status(400).send("Cannot add user ("+uname+")");
    }
});

router.get('/get_users', async (req, res) => {
    console.log("Getting users...");
    await connectToDatabase();

    const users = await userModel.find({});
    if (users) {
        res.send(users);
    } else {
        res.status(400).send("Cannot get users");
    }
});

router.get('/get_user/:username', async (req, res) => {
    console.log("Getting user "+req.params.username+".");
    const uname : string = req.params.username;
    await connectToDatabase();

    const user = await userModel.findOne({username: uname});
    if (user) {
        res.send(user);
    } else {
        res.status(400).send("Cannot get user");
    }
});
