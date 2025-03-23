import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonPageForm from './PersonPageForm';
import { getPerson } from '../../../services/apiService';

jest.mock('../../../services/apiService', () => ({
    getPerson: jest.fn(),
    savePerson: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
}));

describe('PersonPageForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loads existing person data when editing', async () => {
        (getPerson as jest.Mock).mockResolvedValue({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: '30',
            email: 'john.doe@example.com',
        });

        render(
            <MemoryRouter>
                <PersonPageForm />
            </MemoryRouter>
        );
        await waitFor(() => expect(screen.getByLabelText(/First Name/i)).toHaveValue('John'));
        await waitFor(() => expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe'));
        await waitFor(() => expect(screen.getByLabelText(/Age/i)).toHaveValue(30));
        await waitFor(() => expect(screen.getByLabelText(/Email/i)).toHaveValue('john.doe@example.com'));
    });
});