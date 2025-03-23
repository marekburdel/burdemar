package com.example.people_directory.repository;

import com.example.people_directory.model.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    @Query("SELECT p FROM Person p " +
            "WHERE (:firstName IS NULL OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))) " +
            "AND (:lastName IS NULL OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))) " +
            "AND (:age IS NULL OR p.age = :age) " +
            "AND (:ageMin IS NULL OR p.age >= :ageMin) " +
            "AND (:ageMax IS NULL OR p.age <= :ageMax)")
    Page<Person> findByFilters(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("age") Integer age,
            @Param("ageMin") Integer ageMin,
            @Param("ageMax") Integer ageMax,
            Pageable pageable
    );
}