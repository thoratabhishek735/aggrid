import express from "express";
import { filterQuery } from "../controller/query-controller";

const router = express.Router();

router.post('/query',filterQuery);

export default router;