import express from 'express';
import './utils/scheduler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
