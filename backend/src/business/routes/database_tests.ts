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
