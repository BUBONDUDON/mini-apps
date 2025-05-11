import { supabase } from "./supabase";

export const loadTableData = async (tableName) => {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*');

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
};
