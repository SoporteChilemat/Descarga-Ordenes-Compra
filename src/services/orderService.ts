import puppeteer from 'puppeteer';
import { checkCurrentDateInDescarga, insertDescarga, insertOrdenCompra, insertPosicionOrdenCompra, getSmallestOrderNumberByDate } from '../services/descargaService'
import { getCurrentDateISO } from '../utils/dateUtils';

const LOGIN_URL = 'https://chilematprd.authentication.us10.hana.ondemand.com/login';
const ORDER_DETAILS_URL = (folio: number) => `https://portal-prd.chilemat.cl/api/ordendecompra/cabecera?C_NumeroOrdenCompra=${folio}`;
const ORDER_ITEMS_URL = (folio: number, provId: string, docId: string) =>
    `https://portal-prd.chilemat.cl/api/ordendecompra/detalle_oc?C_NumeroOrdenCompra=${folio}&C_IdProvOrdenCompra=${provId}&C_IdClaseDocumentoCompra=${docId}&C_EstadoPosOC=VIGENTE`;

let sessionCookies: any[] = [];
let folio = 0
let globalDate: Date;

export const login = async (username: string, password: string) => {
    const browser = await puppeteer.launch({ headless: true }); // Set to true after debugging
    const page = await browser.newPage();

    try {
        console.log('Starting login process...');
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });

        await page.type('input[name="j_username"]', username);
        await page.type('input[name="j_password"]', password);
        await page.click('button[type="submit"]');

        let cont = 0;

        const sleep = (ms: number): Promise<void> => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };

        while (true && cont < 20) {
            try {
                const currentUrl = page.url();

                console.log('currentUrl', currentUrl);

                if (currentUrl === "https://chilematprd.authentication.us10.hana.ondemand.com/home") {
                    break;
                }
            } catch (e) {
            }
            await sleep(1000);
            cont++;
            console.log("cont: " + cont);
        }

        console.log('Login successful');

        const { exists, date } = await checkCurrentDateInDescarga();

        globalDate = date;

        console.log('exists', exists);

        if (!exists) {
            await page.goto('https://portal-prd.chilemat.cl/asociados', { waitUntil: 'networkidle2' });

            while (true && cont < 20) {
                try {
                    const currentUrl = page.url();

                    console.log('currentUrl', currentUrl);

                    if (currentUrl === "https://portal-prd.chilemat.cl/seleccion") {
                        break;
                    }
                } catch (e) {
                }
                await sleep(1000);
                cont++;
                console.log("cont: " + cont);
            }

            await page.goto('https://portal-prd.chilemat.cl/asociados/ordenes', { waitUntil: 'networkidle2' });

            while (true && cont < 20) {
                try {
                    const currentUrl = page.url();

                    console.log('currentUrl', currentUrl);

                    if (currentUrl === "https://portal-prd.chilemat.cl/asociados") {
                        break;
                    }
                } catch (e) {
                }
                await sleep(1000);
                cont++;
                console.log("cont: " + cont);
            }

            await page.goto('https://portal-prd.chilemat.cl/asociados/ordenes', { waitUntil: 'networkidle2' });

            // Esperar a que el botón esté presente
            await page.waitForFunction(() => {
                return document.evaluate(
                    '//*[@id="root"]/div/div/div[3]/div[4]/div/table/tbody/tr[1]/td[2]/button',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue !== null;
            }, { timeout: 30000 }); // Timeout de 30 segundos

            const buttonValue = await page.evaluate(() => {
                const button = document.evaluate(
                    '//*[@id="root"]/div/div/div[3]/div[4]/div/table/tbody/tr[1]/td[2]/button',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                return button ? (button as HTMLButtonElement).innerText : null;
            });

            if (!buttonValue) {
                throw new Error('Button not found or value is empty');
            }

            folio = +buttonValue;

            console.log('Button Value:', buttonValue);

            insertDescarga(buttonValue);
        } else {
            const currentDate: string = getCurrentDateISO();

            const result = await getSmallestOrderNumberByDate(new Date(currentDate));

            console.log('result', result);

            if (result) {
                folio = +result;
            }
        }

        return page;
    } catch (error) {
        console.error('Error occurred during login process:', error);
        await browser.close();
        throw error;
    }
};

export const fetchOrderData = async (page: any) => {
    try {
        // Navigate to order details page
        await page.goto(ORDER_DETAILS_URL(folio), { waitUntil: 'networkidle2' });

        // Extract order details
        const orderDetails = await page.evaluate(() => JSON.parse(document.body.innerText));

        if (!orderDetails || !orderDetails.length) {
            throw new Error(`No order details found for order ID ${folio}`);
        }

        await insertOrdenCompra(orderDetails[0], globalDate);

        const { C_IdProvOrdenCompra, C_IdClaseDocumentoCompra } = orderDetails[0];

        // Navigate to order items page
        await page.goto(ORDER_ITEMS_URL(folio, C_IdProvOrdenCompra, C_IdClaseDocumentoCompra), { waitUntil: 'networkidle2' });

        // Extract order items
        const orderItems = await page.evaluate(() => JSON.parse(document.body.innerText));

        await insertPosicionOrdenCompra(orderItems.d.results, orderDetails[0].C_NumeroOrdenCompra);

        folio--;

        return {
            orderDetails: orderDetails[0],
            orderItems: orderItems.d.results
        };
    } catch (error) {
        console.error('Error occurred while fetching order data:', error);

        folio--;

        throw error;
    }
};

export const isSessionValid = async (page: any) => {
    try {
        // Set cookies before navigating to the protected page
        await page.setCookie(...sessionCookies);

        // Navigate to a protected page
        const response = await page.goto(ORDER_DETAILS_URL(+folio), { waitUntil: 'networkidle2' });

        // Check the response URL to determine if it was redirected to the login page
        const currentUrl = response.url();
        const isValid = !currentUrl.includes('login');

        return isValid;
    } catch (error) {
        console.error('Session validation failed:', error);
        return false;
    }
};
