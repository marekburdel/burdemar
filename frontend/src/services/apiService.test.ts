import { getPersons } from './apiService';

const mockResponse = {
    data: {
        persons: [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }],
        total: 1,
    },
};

jest.mock('axios', () => ({
    create: () => ({
        get: () => Promise.resolve(mockResponse),
    }),
}));

describe('getPersons', () => {
    it('should fetch persons with the correct parameters', async () => {
        const page = 1;
        const pageSize = 10;
        const filters = { firstName: 'John' };
        const result = await getPersons(page, pageSize, filters);

        expect(result).toEqual(mockResponse.data);
    });
});