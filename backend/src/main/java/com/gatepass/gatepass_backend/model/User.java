package com.gatepass.gatepass_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String name;

    @Column(nullable = false)
    private String role; // STUDENT, TUTOR, WARDEN, SECURITY, ADMIN

    private String email;
    private String phone;
}