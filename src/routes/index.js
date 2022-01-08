import express from "express";
import React from "react";
import { renderToString } from "react-dom/server"
import Index from "../pages/index"
import path from 'path';


const router = express.Router();

router.get('/index', async (req, res) => {
    const reactComp = renderToString(<Index />);
    res.status(200).render('pages/index', { reactApp: reactComp });
})

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname,"..", "client", "index.html"));
});

export default router;