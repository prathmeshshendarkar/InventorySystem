import { communication_db } from "../../models";

export const getOrdersService = async () => {
    return await communication_db.query('SELECT NOW()')
}