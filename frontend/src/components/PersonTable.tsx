import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Button
} from '@mui/material';
import { Person } from '../pages/person/types';
import { useNavigate } from 'react-router-dom';

interface PersonTableProps {
    persons: Person[];
    sortField: keyof Person;
    sortDirection: 'asc' | 'desc';
    onSort: (field: keyof Person) => void;
    onDelete: (id: number) => void;
}

const PersonTable: React.FC<PersonTableProps> = ({ persons, sortField, sortDirection, onSort, onDelete }) => {
    const sortedPersons = [...persons].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const navigate = useNavigate();
    const handleEdit = (id: number) => {
        navigate(`/persons/${id}`);
    };

    return (
        <TableContainer component={Paper}>
            <Table data-testid="person-table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortField === 'firstName'}
                                direction={sortField === 'firstName' ? sortDirection : 'asc'}
                                onClick={() => onSort('firstName')}
                            >
                                First Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortField === 'lastName'}
                                direction={sortField === 'lastName' ? sortDirection : 'asc'}
                                onClick={() => onSort('lastName')}
                            >
                                Last Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortField === 'age'}
                                direction={sortField === 'age' ? sortDirection : 'asc'}
                                onClick={() => onSort('age')}
                            >
                                Age
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={sortField === 'email'}
                                direction={sortField === 'email' ? sortDirection : 'asc'}
                                onClick={() => onSort('email')}
                            >
                                Email
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedPersons.map((person) => (
                        <TableRow key={person.id}>
                            <TableCell>{person.firstName}</TableCell>
                            <TableCell>{person.lastName}</TableCell>
                            <TableCell>{person.age}</TableCell>
                            <TableCell>{person.email}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(person.id)} variant="outlined" sx={{ mr: 1 }}>
                                    Edit
                                </Button>
                                <Button onClick={() => onDelete(person.id)} variant="outlined" color="error">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PersonTable;