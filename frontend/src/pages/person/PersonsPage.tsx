import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Box, TextField, Typography, Slider} from '@mui/material';
import PersonTable from '../../components/PersonTable';
import PaginationComponent from '../../components/PaginationComponent';
import { Person } from './types';
import { getPersons, deletePerson } from '../../services/apiService';

const PersonsPage = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);
    const [sortField, setSortField] = useState<keyof Person>('firstName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [ageRange, setAgeRange] = useState<number[]>([18, 60]);

    const fetchPersons = React.useCallback((currentPage: number) => {
        getPersons(currentPage, pageSize, {
            firstName,
            lastName,
            age,
            ageMin: ageRange[0],
            ageMax: ageRange[1],
        })
            .then((data) => {
                setPersons(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((error) => console.error('Error fetching persons:', error));
    }, [firstName, lastName, age, ageRange, pageSize]);

    useEffect(() => {
        fetchPersons(page);
    }, [page, sortField, sortDirection, firstName, lastName, age, ageRange, sortField, sortDirection, fetchPersons]);

    const handleDelete = (id: number) => {
        deletePerson(id)
            .then(() => {
                setPersons(persons.filter((person) => person.id !== id));
            })
            .catch((error) => console.error('Error deleting person:', error));
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchPersons(page);
    };


    const handleAddPerson = () => {
        navigate('/persons/create');
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleSort = (field: keyof Person) => {
        const isSameField = field === sortField;
        setSortDirection(isSameField && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    return (
        <div>
            <h1>Persons List</h1>

            <Box component="form" onSubmit={handleFilterSubmit} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <TextField label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                <Box sx={{ width: 300, p: 2 }}>
                    <Typography gutterBottom>Age Range: {ageRange[0]} - {ageRange[1]}</Typography>
                    <Slider
                        value={ageRange}
                        onChange={(_e, newValue) => setAgeRange(newValue as number[])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={150}
                    />
                </Box>
            </Box>
            <Button variant="contained" onClick={handleAddPerson} sx={{ mb: 2 }}>
                Add New Person
            </Button>
            <PersonTable
                persons={persons}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onDelete={handleDelete}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <PaginationComponent count={totalPages} page={page} onPageChange={handlePageChange} />
            </Box>
        </div>
    );
};

export default PersonsPage;