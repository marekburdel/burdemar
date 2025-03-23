package com.example.people_directory.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
