package com.gatepass.gatepass_backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private Long id;
    private String name;
    private String role;
    // In a real app, you would return a JWT token here

    public LoginResponse(Long id, String name, String role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}
