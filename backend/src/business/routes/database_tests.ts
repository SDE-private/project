import { Router } from 'express';
import { userModel, connectToDatabase, createUser } from '../database/database.js';

const router = Router();
export default router;

//respond to GET requests on /db-tests
router.get('/conn', async (req, res) => {
    console.log("avviando la connessione")

    const connected = await connectToDatabase();
    if (connected) {
        res.send("connessione avvenuta");
    } else {
        res.send("connessione fallita");
    }
});

router.post('/add_user', async (req, res) => {
    console.log("aggiungo un utente")
    const uname : string = req.body.username;
    const mail : string = req.body.email;

    await connectToDatabase();

    const created : boolean = await createUser({username: uname, email: mail});
    if (created) {
        res.send("utente aggiunto");
    } else {
        res.send("utente non aggiunto");
    }
});
