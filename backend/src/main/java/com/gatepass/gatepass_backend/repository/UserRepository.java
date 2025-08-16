package com.gatepass.gatepass_backend.repository;

import com.gatepass.gatepass_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    // New method to find all users of a specific role
    List<User> findByRole(String role);
}