import { Router, Request, Response } from 'express';
import { getOrdersWithPositions, getOrdersWithPositionsNot } from '../services/descargaService';

const OrdenesRouter = Router();

OrdenesRouter.get('/getOrdersWithPositions/:rut', async (req: Request, res: Response) => {
    const { rut } = req.params;

    try {
        const orders = await getOrdersWithPositions(rut);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

OrdenesRouter.get('/getOrdersWithPositionsNot/:rut', async (req: Request, res: Response) => {
    const { rut } = req.params;

    try {
        const orders = await getOrdersWithPositionsNot(rut);
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

export default OrdenesRouter;
