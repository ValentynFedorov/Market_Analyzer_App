import axios from 'axios';
import { stringify } from 'qs'; // <-- 1. Імпортуємо qs

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    paramsSerializer: params => {
        return stringify(params, { arrayFormat: 'repeat' }); // Форматуємо масиви як ?skills=Python&skills=Docker
    }
});

const fetchData = async (endpoint, filters) => {
    try {
        const response = await apiClient.get(endpoint, { params: filters });
        return response.data;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw error;
    }
};

export const getFilterOptions = () => fetchData('/filters/options');
export const getDemandData = (filters) => fetchData('/demand/', filters);
export const getSalaryData = (filters) => fetchData('/salary/', filters);
export const getSkillsData = (filters) => fetchData('/skills/', filters);