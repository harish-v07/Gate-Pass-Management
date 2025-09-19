package com.gatepass.gatepass_backend.controller;

import com.gatepass.gatepass_backend.dto.PasswordChangeRequest;
import com.gatepass.gatepass_backend.dto.UserDto;
import com.gatepass.gatepass_backend.model.User;
import com.gatepass.gatepass_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDto>> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.findByRole(role));
    }
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User details) {
        try {
            return ResponseEntity.ok(userService.updateUserProfile(id, details));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest r) {
        try { userService.changePassword(id, r.getCurrentPassword(), r.getNewPassword());
            return ResponseEntity.ok("Password changed successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
