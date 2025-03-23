import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
    withCredentials: true,
});

export const getPersons = async (
    page: number,
    pageSize: number,
    filters: { firstName?: string; lastName?: string; age?: string; ageMin?: number; ageMax?: number } = {}
) => {
    try {
        const params: any = {
            page: page - 1,
            size: pageSize,
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params[key] = value;
            }
        });

        const response = await axiosInstance.get('/api/persons', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPerson = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/persons/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const savePerson = async (person: any, id?: number) => {
    try {
        const apiCall = id
            ? axiosInstance.put(`/api/persons/${id}`, person)
            : axiosInstance.post('/api/persons', person);
        const response = await apiCall;
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deletePerson = async (id: number) => {
    try {
        await axiosInstance.delete(`/api/persons/${id}`);
    } catch (error) {
        throw error;
    }
};