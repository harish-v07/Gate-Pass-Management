package com.gatepass.gatepass_backend.controller;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gatepass")
@CrossOrigin(origins = "*")
public class GatePassController {

    @Autowired
    private GatePassService gatePassService;

    @PostMapping("/request")
    public ResponseEntity<GatePassRequest> createRequest(@RequestBody GatePassRequest request) {
        return ResponseEntity.ok(gatePassService.createRequest(request));
    }

    @GetMapping("/pending/tutor/{tutorId}")
    public ResponseEntity<List<GatePassRequest>> getTutorPendingRequests(@PathVariable Long tutorId) {
        return ResponseEntity.ok(gatePassService.getPendingTutorRequests(tutorId));
    }

    @GetMapping("/pending/warden/{wardenId}")
    public ResponseEntity<List<GatePassRequest>> getWardenPendingRequests(@PathVariable Long wardenId) {
        return ResponseEntity.ok(gatePassService.getPendingWardenRequests(wardenId));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<GatePassRequest>> getApprovedRequests() {
        // Note: This is a general "approved" list, not specific to a warden.
        // You might want to change this logic later if needed.
        return ResponseEntity.ok(gatePassService.getRequestsByStatus("APPROVED"));
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestParam String role, @RequestParam Long approverId) {
        try {
            return ResponseEntity.ok(gatePassService.approveRequest(id, role, approverId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(gatePassService.rejectRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GatePassRequest>> getRequestsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gatePassService.getRequestsByStudentId(studentId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            gatePassService.deleteRequest(id);
            return ResponseEntity.ok().build(); // Standard success response for delete
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/history/tutor/{tutorId}")
    public ResponseEntity<List<GatePassRequest>> getTutorHistory(@PathVariable Long tutorId) {
        return ResponseEntity.ok(gatePassService.getTutorHistory(tutorId));
    }

    @GetMapping("/history/warden/{wardenId}")
    public ResponseEntity<List<GatePassRequest>> getWardenHistory(@PathVariable Long wardenId) {
        return ResponseEntity.ok(gatePassService.getWardenHistory(wardenId));
    }

    // ** NEW ENDPOINT FOR MODIFYING APPROVAL **
    @PostMapping("/modify/{id}")
    public ResponseEntity<?> modifyApproval(@PathVariable Long id, @RequestParam String role) {
        try {
            return ResponseEntity.ok(gatePassService.modifyApproval(id, role));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}