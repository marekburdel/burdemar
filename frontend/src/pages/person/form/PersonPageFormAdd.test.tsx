import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonPageForm from './PersonPageForm';
import { savePerson } from '../../../services/apiService';

jest.mock('../../../services/apiService', () => ({
    getPerson: jest.fn(),
    savePerson: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }),
}));

describe('PersonPageForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form with empty fields for new person', () => {
        render(
            <MemoryRouter>
                <PersonPageForm />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('');
        expect(screen.getByLabelText(/Age/i)).toHaveValue(null);
        expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    });

    test('allows user input and submits the form', async () => {
        (savePerson as jest.Mock).mockResolvedValue({});
        render(
            <MemoryRouter>
                <PersonPageForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '28' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@example.com' } });

        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(savePerson).toHaveBeenCalledWith(
                { firstName: 'Alice', lastName: 'Smith', age: 28, email: 'alice@example.com' },
                undefined
            );
        });
        await waitFor(() => {expect(mockNavigate).toHaveBeenCalledWith('/persons/');});
    });

    test('shows error message if API call fails', async () => {
        (savePerson as jest.Mock).mockRejectedValue(new Error('Failed to save'));

        render(
            <MemoryRouter>
                <PersonPageForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Alice' } });
        fireEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => expect(savePerson).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    });
});