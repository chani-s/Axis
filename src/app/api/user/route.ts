import express from "express";
import { User } from '../../models/User';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).send({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
