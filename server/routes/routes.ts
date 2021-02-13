import {Router} from "express";
import testUserRouter from "./getUser";

const routes = Router();

routes.use('/users', testUserRouter);

export default routes;