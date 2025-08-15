package com.gatepass.gatepass_backend.controller;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gatepass")
@CrossOrigin(origins = "*") // For development only
public class GatePassController {

    @Autowired
    private GatePassService gatePassService;

    @PostMapping("/request")
    public ResponseEntity<GatePassRequest> createRequest(@RequestBody GatePassRequest request) {
        return ResponseEntity.ok(gatePassService.createRequest(request));
    }

    @GetMapping("/pending/tutor")
    public ResponseEntity<List<GatePassRequest>> getTutorPendingRequests() {
        return ResponseEntity.ok(gatePassService.getRequestsByStatus("PENDING_TUTOR_APPROVAL"));
    }

    @GetMapping("/pending/warden")
    public ResponseEntity<List<GatePassRequest>> getWardenPendingRequests() {
        return ResponseEntity.ok(gatePassService.getRequestsByStatus("PENDING_WARDEN_APPROVAL"));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<GatePassRequest>> getApprovedRequests() {
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
}