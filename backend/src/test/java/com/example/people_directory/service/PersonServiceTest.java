package com.example.people_directory.service;

import com.example.people_directory.dto.PersonDTO;
import com.example.people_directory.model.Person;
import com.example.people_directory.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PersonServiceTest {

    @Mock
    private PersonRepository personRepository;

    @InjectMocks
    private PersonService personService;

    private Person testPerson;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        testPerson = new Person();
        testPerson.setId(1L);
        testPerson.setFirstName("John");
        testPerson.setLastName("Doe");
        testPerson.setAge(30);
        testPerson.setEmail("john.doe@example.com");

        pageable = PageRequest.of(0, 5);
    }

    @Test
    void getFilteredPersons_ShouldCallRepositoryWithFilters() {
        Page<Person> expectedPage = new PageImpl<>(List.of(testPerson));
        when(personRepository.findByFilters("John", null, null, null, null, pageable))
                .thenReturn(expectedPage);

        Page<Person> result = personService.getFilteredPersons("John", null, null, null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("John", result.getContent().get(0).getFirstName());
        verify(personRepository, times(1))
                .findByFilters("John", null, null, null, null, pageable);
    }

    @Test
    void getPersonById_WhenPersonExists() {
        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));

        Person result = personService.getPersonById(1L);

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        verify(personRepository, times(1)).findById(1L);
    }

    @Test
    void getPersonById_WhenPersonNotFound() {
        when(personRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            personService.getPersonById(1L);
        });
        assertEquals("Person not found", exception.getMessage());
        verify(personRepository, times(1)).findById(1L);
    }

    @Test
    void updatePerson_WhenPersonExists() {
        Person updatedPerson = new Person();
        updatedPerson.setFirstName("Jane");
        updatedPerson.setLastName("Doe");
        updatedPerson.setAge(31);
        updatedPerson.setEmail("jane.doe@example.com");

        when(personRepository.findById(1L)).thenReturn(Optional.of(testPerson));
        when(personRepository.save(any(Person.class))).thenReturn(testPerson);

        Person result = personService.updatePerson(1L, map(updatedPerson));

        assertNotNull(result);
        assertEquals("Jane", result.getFirstName());
        assertEquals(31, result.getAge());
        verify(personRepository, times(1)).findById(1L);
        verify(personRepository, times(1)).save(testPerson);
    }

    @Test
    void updatePerson_WhenPersonNotFound() {
        Person updatedPerson = new Person();
        when(personRepository.findById(1L)).thenReturn(Optional.empty());

        Person result = personService.updatePerson(1L, map(updatedPerson));

        assertNull(result);
        verify(personRepository, times(1)).findById(1L);
        verify(personRepository, never()).save(any(Person.class));
    }

    @Test
    void savePerson_ShouldCallRepositorySave() {
        when(personRepository.save(any())).thenReturn(testPerson);
        Person result = personService.savePerson(map(testPerson));

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        verify(personRepository, times(1)).save(any());
    }

    @Test
    void deletePerson_ShouldCallRepositoryDelete() {
        doNothing().when(personRepository).deleteById(1L);

        personService.deletePerson(1L);

        verify(personRepository, times(1)).deleteById(1L);
    }

    @Test
    void deletePerson_ShouldThrowException_WhenRepositoryFails() {
        doThrow(new RuntimeException("Delete failed")).when(personRepository).deleteById(1L);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            personService.deletePerson(1L);
        });
        assertEquals("Delete failed", exception.getMessage());
        verify(personRepository, times(1)).deleteById(1L);
    }

    private PersonDTO map(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setFirstName(person.getFirstName());
        dto.setLastName(person.getLastName());
        dto.setAge(person.getAge());
        dto.setEmail(person.getEmail());
        return dto;
    }
}