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
@CrossOrigin(origins = "*") // For development only
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Find the user by their username
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        // Check if the user exists and the password matches
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                // If credentials are correct, return user details with a 200 OK status
                LoginResponse response = new LoginResponse(user.getId(), user.getName(), user.getRole());
                return ResponseEntity.ok(response);
            }
        }

        // If user not found or password incorrect, return a 401 Unauthorized status
        return ResponseEntity.status(401).body("Invalid credentials");
    }
    // ** NEW METHOD FOR REGISTRATION **
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        // Check if username already exists
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body("Username is already taken!");
        }

        // In a real app, you should hash the password here before saving
        // newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }
}