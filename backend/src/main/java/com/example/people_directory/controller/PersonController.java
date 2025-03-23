package com.example.people_directory.controller;

import com.example.people_directory.dto.PersonDTO;
import com.example.people_directory.model.Person;
import com.example.people_directory.service.PersonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public Page<Person> getPersons(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return personService.getFilteredPersons(firstName, lastName, age, ageMin, ageMax, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable Long id) {
        Person person = personService.getPersonById(id);
        return ResponseEntity.ok(person); // todo not found
    }

    @PostMapping
    public ResponseEntity<Person> createPerson(@RequestBody @Valid PersonDTO person) {
        Person savedPerson = personService.savePerson(person);
        return ResponseEntity.status(201).body(savedPerson); // todo some exception
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editPerson(@PathVariable Long id, @RequestBody @Valid PersonDTO person) {
        Person updatedPerson = personService.updatePerson(id, person);
        if (updatedPerson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Person not found.");
        }
        return ResponseEntity.ok(updatedPerson);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.ok("Person deleted successfully."); // todo unhappy scenario
    }
}