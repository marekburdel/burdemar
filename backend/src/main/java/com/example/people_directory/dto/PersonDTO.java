package com.example.people_directory.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private Long id;

    @NotBlank()
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank()
    @Size(min = 2, max = 50)
    private String lastName;

    @NotNull
    @Min(value = 0)
    @Max(value = 150)
    private int age;

    @NotBlank
    @Email
    @Size(max = 320)
    private String email;
}
