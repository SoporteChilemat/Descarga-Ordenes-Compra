import express from "express";
import OrdenesRouter from "./ordersController";

const routerApi = (app: any) => {
    const router = express.Router();

    app.use("/api/v1", router);

    router.use("/ordenesCompra", OrdenesRouter);
};

export default routerApi;
