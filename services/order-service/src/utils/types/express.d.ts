declare global {
    namespace Express {
        interface Request {
            validated?: {
                query?: any;
                params?: any;
                body?: any;
            };
        }
    }
}

export {};