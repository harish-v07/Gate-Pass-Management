package com.gatepass.gatepass_backend.service;

import com.gatepass.gatepass_backend.model.User;
import com.gatepass.gatepass_backend.repository.GatePassRequestRepository;
import com.gatepass.gatepass_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired private UserRepository userRepository;
    @Autowired private GatePassRequestRepository gatePassRequestRepository;

    public List<User> getAllUsers() { return userRepository.findAll(); }

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalStateException("Username already taken.");
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty() && userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use.");
        }
        return userRepository.save(user);
    }

    public User updateUser(Long userId, User userDetails) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Add robust validation before attempting to save.
        if (userDetails.getName() == null || userDetails.getName().trim().isEmpty()) {
            throw new IllegalStateException("User name cannot be empty.");
        }
        if (userDetails.getUsername() == null || userDetails.getUsername().trim().isEmpty()) {
            throw new IllegalStateException("Username cannot be empty.");
        }

        // Check for username uniqueness
        Optional<User> userByUsername = userRepository.findByUsername(userDetails.getUsername());
        if (userByUsername.isPresent() && !userByUsername.get().getId().equals(userId)) {
            throw new IllegalStateException("Username '" + userDetails.getUsername() + "' is already taken.");
        }

        // Check for email uniqueness
        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty()) {
            Optional<User> userByEmail = userRepository.findByEmail(userDetails.getEmail());
            if (userByEmail.isPresent() && !userByEmail.get().getId().equals(userId)) {
                throw new IllegalStateException("Email '" + userDetails.getEmail() + "' is already in use.");
            }
        }

        // Update the user's details
        existingUser.setName(userDetails.getName());
        existingUser.setUsername(userDetails.getUsername());

        // If the provided email is an empty string, treat it as null to avoid unique constraint violations.
        if (userDetails.getEmail() != null && userDetails.getEmail().trim().isEmpty()) {
            existingUser.setEmail(null);
        } else {
            existingUser.setEmail(userDetails.getEmail());
        }

        existingUser.setRole(userDetails.getRole());

        // Only update the password if a new one was provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
            existingUser.setPassword(userDetails.getPassword());
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        boolean hasAssociations = !gatePassRequestRepository.findByStudentId(userId).isEmpty() ||
                !gatePassRequestRepository.findByTutorId(userId).isEmpty() ||
                !gatePassRequestRepository.findByWardenId(userId).isEmpty();
        if (hasAssociations) {
            throw new IllegalStateException("Cannot delete user with active gate pass requests.");
        }
        userRepository.deleteById(userId);
    }
}

