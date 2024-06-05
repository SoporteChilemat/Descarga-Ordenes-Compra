import * as orderService from '../services/orderService';

let page: any = null; // This will hold the Puppeteer page object

const getRandomDelay = () => {
    return Math.floor(Math.random() * 16) * 1000; // Random delay between 0 and 15 seconds (in milliseconds)
};

const isWithinWorkingHours = () => {
    const now = new Date();

    console.log('now', now);

    const hour = now.getHours();
    return hour >= 8 && hour < 18;
};

const downloadOrderData = async () => {
    try {
        if (!page || !(await orderService.isSessionValid(page))) {
            console.log('Session invalid or not found. Logging in...');
            page = await orderService.login('soporte@ftoso.cl', 'qweASDzxc123*');
        }
        const data = await orderService.fetchOrderData(page);
        console.log(`Data for order downloaded.`, data);
        // Process the data as needed
    } catch (error: any) {
        console.error(`Error downloading data for order:`, error.message);
    }
};

const scheduleNextExecution = () => {
    const delay = getRandomDelay();
    console.log(`Next execution scheduled in ${delay / 1000} seconds`);
    setTimeout(async () => {
        if (isWithinWorkingHours()) {
            await downloadOrderData();
        } else {
            console.log('Outside of working hours. Task not executed.');
        }
        scheduleNextExecution(); // Schedule the next execution
    }, delay);
};

// Initial schedule setup
export const startScheduler = () => {
    console.log('Scheduler initialized. Task will run with random intervals between 0 and 15 seconds within working hours (8:00 AM to 6:00 PM).');
    scheduleNextExecution();
};

console.log('Scheduler initialized. Task will run with random intervals between 0 and 15 seconds within working hours (8:00 AM to 6:00 PM).');
