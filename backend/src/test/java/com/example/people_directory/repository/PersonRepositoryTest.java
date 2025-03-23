package com.example.people_directory.repository;

import com.example.people_directory.model.Person;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@EntityScan("com.example.people_directory.model")
class PersonRepositoryTest {

    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String EMAIL = "john.doe@example.com";
    private static final int AGE = 35;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PersonRepository personRepository;

    private Person testPerson;

    @BeforeEach
    void setUp() {
        testPerson = new Person();
        testPerson.setFirstName(FIRST_NAME);
        testPerson.setLastName(LAST_NAME);
        testPerson.setEmail(EMAIL);
        testPerson.setAge(AGE);
        entityManager.persist(testPerson);

        entityManager.flush();
    }

    @Test
    void whenSavePerson_thenCreatePersonSuccessfully() {
        Person person = new Person();
        person.setFirstName(FIRST_NAME);
        person.setLastName(LAST_NAME);
        person.setEmail("changed@example.com");
        person.setAge(AGE);

        Person savedPerson = personRepository.save(person);
        assertThat(savedPerson.getId()).isNotNull();

        Person createdPerson = personRepository.findById(savedPerson.getId()).get();

        assertThat(createdPerson.getFirstName()).isEqualTo(FIRST_NAME);
        assertThat(createdPerson.getLastName()).isEqualTo(LAST_NAME);
        assertThat(createdPerson.getEmail()).isEqualTo("changed@example.com");
        assertThat(createdPerson.getAge()).isEqualTo(AGE);
    }

    @Test
    void whenFindById_thenReturnPerson() {
        Optional<Person> foundPerson = personRepository.findById(testPerson.getId());
        assertTrue(foundPerson.isPresent());
        assertThat(foundPerson.get().getEmail()).isEqualTo(EMAIL);
    }

    @Test
    void whenFindByNonExistentId_thenReturnEmpty() {
        Optional<Person> foundPerson = personRepository.findById(999L);
        assertFalse(foundPerson.isPresent());
    }

    @Test
    void whenFindAll_thenReturnListOfPeople() {
        List<Person> people = personRepository.findAll();
        assertThat(people).isNotEmpty();
        assertThat(people).contains(testPerson);
    }

    @Test
    void whenUpdatePerson_thenUpdateSuccessfully() {
        testPerson.setAge(40);
        personRepository.save(testPerson);

        Person updatedPerson = personRepository.findById(testPerson.getId()).orElse(null);
        assertNotNull(updatedPerson);
        assertThat(updatedPerson.getAge()).isEqualTo(40);
    }

    @Test
    void whenDeletePerson_thenRemoveSuccessfully() {
        personRepository.delete(testPerson);
        Optional<Person> deletedPerson = personRepository.findById(testPerson.getId());
        assertFalse(deletedPerson.isPresent());
    }

    @Test
    void whenFindByFilters_thenReturnMatchingPersons() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Person> result = personRepository.findByFilters("John", "Doe", 35, null, null, pageable);

        assertThat(result).isNotEmpty();
        assertThat(result.getContent()).contains(testPerson);
    }

    @Test
    void whenFindByFiltersWithAgeRange_thenReturnMatchingPersons() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Person> result = personRepository.findByFilters(null, null, null, 30, 40, pageable);

        assertThat(result).isNotEmpty();
        assertThat(result.getContent()).contains(testPerson);
    }

    @Test
    void whenFindByFiltersWithNoMatch_thenReturnEmpty() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Person> result = personRepository.findByFilters("NonExistent", null, null, null, null, pageable);

        assertThat(result).isEmpty();
    }
}