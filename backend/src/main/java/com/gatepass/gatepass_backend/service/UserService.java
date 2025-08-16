package com.gatepass.gatepass_backend.service;

import com.gatepass.gatepass_backend.dto.UserDto;
import com.gatepass.gatepass_backend.model.User;
import com.gatepass.gatepass_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> updateUserProfile(Long userId, User profileDetails) {
        return userRepository.findById(userId).map(user -> {
            user.setName(profileDetails.getName());
            user.setEmail(profileDetails.getEmail());
            user.setPhone(profileDetails.getPhone());
            return userRepository.save(user);
        });
    }

    public List<UserDto> findUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(user -> new UserDto(user.getId(), user.getName()))
                .collect(Collectors.toList());
    }
}