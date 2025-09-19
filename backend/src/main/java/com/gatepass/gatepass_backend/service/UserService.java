package com.gatepass.gatepass_backend.service;

import com.gatepass.gatepass_backend.model.User;
import com.gatepass.gatepass_backend.repository.UserRepository;
import com.gatepass.gatepass_backend.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    public User updateUserProfile(Long userId, User userDetails) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Add validation to prevent saving an empty name.
        if (userDetails.getName() == null || userDetails.getName().trim().isEmpty()) {
            throw new IllegalStateException("User name cannot be empty.");
        }

        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            Optional<User> existingUserWithEmail = userRepository.findByEmail(userDetails.getEmail());
            if (existingUserWithEmail.isPresent()) {
                throw new IllegalStateException("Email is already in use by another account.");
            }
        }

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        return userRepository.save(user);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Current password does not match");
        }
        user.setPassword(newPassword);
        userRepository.save(user);
    }

    public List<UserDto> findByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(u -> new UserDto(u.getId(), u.getName()))
                .collect(Collectors.toList());
    }
}
