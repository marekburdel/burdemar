import {render, screen, waitFor} from '@testing-library/react';
import PersonTable from './PersonTable';
import {MemoryRouter} from "react-router-dom";

test('renders person list without filters', async () => {
    const persons = [
        { id: 1, firstName: 'John', lastName: 'Doe', age: 40, email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane@example.com' }
    ];

    render(
        <MemoryRouter>
            <PersonTable persons={persons} sortField="firstName" sortDirection="asc" onSort={() => {}} onDelete={() => {}} />
        </MemoryRouter>
    );

    await waitFor(() => {expect(screen.getByText('First Name')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('Last Name')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('Age')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('Email')).toBeInTheDocument();});

    await waitFor(() => {expect(screen.getByText('John')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('Doe')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText(40)).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('john@example.com')).toBeInTheDocument();});

    await waitFor(() => {expect(screen.getByText('Jane')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('Smith')).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText(35)).toBeInTheDocument();});
    await waitFor(() => {expect(screen.getByText('jane@example.com')).toBeInTheDocument();});
});