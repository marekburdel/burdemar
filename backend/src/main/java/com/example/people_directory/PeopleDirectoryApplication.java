package com.example.people_directory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@PropertySource("classpath:secrets.properties")
@CrossOrigin(origins = "http://localhost:3000")
public class PeopleDirectoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(PeopleDirectoryApplication.class, args);
    }

}
