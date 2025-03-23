package com.example.people_directory.service;

import com.example.people_directory.dto.PersonDTO;
import com.example.people_directory.model.Person;
import com.example.people_directory.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Page<Person> getFilteredPersons(String firstName, String lastName, Integer age, Integer ageMin, Integer ageMax, Pageable pageable) {
        return personRepository.findByFilters(firstName, lastName, age, ageMin, ageMax, pageable);
    }

    public Person getPersonById(Long id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Person not found"));
    }

    public Person updatePerson(Long id, PersonDTO person) {
        Person existingPerson = personRepository.findById(id).orElse(null);
        if (existingPerson == null) {
            return null;
        }

        existingPerson.setFirstName(person.getFirstName());
        existingPerson.setLastName(person.getLastName());
        existingPerson.setAge(person.getAge());
        existingPerson.setEmail(person.getEmail());

        return personRepository.save(existingPerson);
    }

    public Person savePerson(PersonDTO person) {
        return personRepository.save(map(person));
    }

    public void deletePerson(Long id) {
        personRepository.deleteById(id);
    }

    private Person map(PersonDTO personDTO) {
        Person person = new Person();
        person.setFirstName(personDTO.getFirstName());
        person.setLastName(personDTO.getLastName());
        person.setAge(personDTO.getAge());
        person.setEmail(personDTO.getEmail());
        return person;
    }
}