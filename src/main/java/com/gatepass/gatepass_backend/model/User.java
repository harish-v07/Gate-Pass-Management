package com.gatepass.gatepass_backend.model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // Store hashed passwords in a real app
    private String name;
    private String role; // e.g., STUDENT, TUTOR, WARDEN, SECURITY
}