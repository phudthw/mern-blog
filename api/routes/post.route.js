import express from "express";
import { verifyToken } from '../utils/verifyuser.js'
import { create } from "../controllers/post.controller.js";

const route = express.Router()

route.post('/create', verifyToken, create)

export default route