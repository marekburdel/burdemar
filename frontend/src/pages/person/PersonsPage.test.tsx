import React from 'react';
import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonsPage from './PersonsPage';
import { getPersons, deletePerson } from '../../services/apiService';

jest.mock('../../services/apiService', () => ({
    getPersons: jest.fn(),
    deletePerson: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('PersonsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getPersons as jest.Mock).mockResolvedValue({
            content: [
                { id: 1, firstName: 'John', lastName: 'Doe', age: 40, email: 'john@example.com' },
                { id: 2, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane@example.com' }
            ],
            totalPages: 2,
        });
    });

    test('renders person list with header and pagination on initial load', async () => {
        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );

        await waitFor(() => { expect(screen.getByText('Persons List')).toBeInTheDocument(); });
        await waitFor(() => { expect(screen.getByText('Add New Person')).toBeInTheDocument(); });

        const table = screen.getByTestId('person-table');
        await waitFor(() => { expect(table).toBeInTheDocument(); });

        await waitFor(() => { expect(screen.getByText('1')).toBeInTheDocument(); });
        await waitFor(() => { expect(screen.getByText('2')).toBeInTheDocument(); });

        expect(getPersons).toHaveBeenCalledWith(1, 5, {"age": "", "ageMax": 60, "ageMin": 18, "firstName": "", "lastName": ""});
    });

    test('fetches new page when pagination is clicked', async () => {
        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );
        await waitFor(() => { expect(getPersons).toHaveBeenCalledWith(1, 5, {"age": "", "ageMax": 60, "ageMin": 18, "firstName": "", "lastName": ""}); });

        fireEvent.click(screen.getByLabelText('Go to next page'));
        await waitFor(() => { expect(getPersons).toHaveBeenCalledWith(2, 5, {"age": "", "ageMax": 60, "ageMin": 18, "firstName": "", "lastName": ""}); });

        fireEvent.click(screen.getByLabelText('Go to previous page'));
        await waitFor(() => { expect(getPersons).toHaveBeenCalledWith(1, 5, {"age": "", "ageMax": 60, "ageMin": 18, "firstName": "", "lastName": ""}); });
    });

    test('handles sorting when sort button is clicked', async () => {
        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );
        const table = screen.getByTestId('person-table');
        const { getByText } = within(table);
        fireEvent.click(getByText('First Name'));
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            const personRows = rows.slice(1);
            const firstNames = personRows.map(row => within(row).getByText(/John|Jane/).textContent);
            expect(firstNames).toEqual(['John', 'Jane']);
        });

        fireEvent.click(getByText('First Name'));
        await waitFor(() => {
            const rows = screen.getAllByRole('row');
            const personRows = rows.slice(1);
            const firstNames = personRows.map(row => within(row).getByText(/John|Jane/).textContent);
            expect(firstNames).toEqual(['Jane', 'John']);
        });

    });

    test('deletes person when delete button is clicked', async () => {
        (deletePerson as jest.Mock).mockResolvedValue({});

        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[1]);

        await waitFor(() => { expect(deletePerson).toHaveBeenCalledWith(1); });

        await waitFor(() => { expect(screen.queryByText('John')).not.toBeInTheDocument(); });
        await waitFor(() => { expect(screen.getByText('Jane')).toBeInTheDocument(); });

    });

    test('navigates to create page when Add New Person is clicked', async () => {
        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Add New Person'));

        expect(mockNavigate).toHaveBeenCalledWith('/persons/create');
    });

    test('handles error when fetching persons fails', async () => {
        (getPersons as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

        render(
            <MemoryRouter>
                <PersonsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getPersons).toHaveBeenCalledWith(1, 5, {"age": "", "ageMax": 60, "ageMin": 18, "firstName": "", "lastName": ""});
        });

        // Since error is logged to console, just ensure component renders
        expect(screen.getByText('Persons List')).toBeInTheDocument();
        const rows = screen.getAllByRole('row');
        const personRows = rows.slice(1);
        await waitFor(() => { expect(personRows).toEqual([]); });
    });
});