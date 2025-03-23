import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { getPerson, savePerson } from '../../../services/apiService';

const PersonPageForm = () => {
    const [person, setPerson] = useState({
        firstName: '',
        lastName: '',
        age: '',
        email: ''
    });
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            getPerson(Number(id))
                .then(response => {
                    setPerson(prevPerson => ({
                        ...prevPerson,
                        ...response
                    }));
                })
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerson(prevPerson => ({
            ...prevPerson,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const personToSave = {
            ...person,
            age: person.age ? Number(person.age) : undefined
        };
        savePerson(personToSave, id ? Number(id) : undefined)
            .then(() => navigate('/persons/'))
            .catch(error => console.error('Error saving person data:', error));
    };

    return (
        <Container maxWidth="sm">
            <Box mt={3}>
                <Typography variant="h4">{id ? 'Edit Person' : 'Add New Person'}</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={person.firstName}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={person.lastName}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        value={person.age}
                        onChange={handleChange}
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={person.email}
                        onChange={handleChange}
                        margin="normal"
                        type="email"
                    />
                    <Box mt={2}>
                        <Button variant="contained" color="primary" type="submit">
                            {id ? 'Update' : 'Add'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default PersonPageForm;