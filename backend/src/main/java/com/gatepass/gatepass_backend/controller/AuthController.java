package com.gatepass.gatepass_backend.controller;

import com.gatepass.gatepass_backend.dto.LoginRequest;
import com.gatepass.gatepass_backend.dto.LoginResponse;
import com.gatepass.gatepass_backend.model.User;
import com.gatepass.gatepass_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest r) {
        Optional<User> uOpt = userRepository.findByUsername(r.getUsername());
        if (uOpt.isPresent() && uOpt.get().getPassword().equals(r.getPassword())) {
            User u = uOpt.get();
            return ResponseEntity.ok(new LoginResponse(u.getId(), u.getName(), u.getRole(), u.getEmail(), u.getPhone()));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
