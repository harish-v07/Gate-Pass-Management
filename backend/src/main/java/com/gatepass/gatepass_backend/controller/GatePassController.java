package com.gatepass.gatepass_backend.controller;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gatepass")
public class GatePassController {
    @Autowired
    private GatePassService gatePassService;
    @PostMapping("/request")
    public ResponseEntity<GatePassRequest> createRequest(@RequestBody GatePassRequest r) {
        return ResponseEntity.ok(gatePassService.createRequest(r));
    }
    @GetMapping("/approved")
    public ResponseEntity<List<GatePassRequest>> getApproved() {
        return ResponseEntity.ok(gatePassService.getRequestsByStatus("APPROVED"));
    }
    @GetMapping("/pending/tutor/{id}")
    public ResponseEntity<List<GatePassRequest>> getPendingTutor(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getPendingRequestsForTutor(id)); }
    @GetMapping("/pending/warden/{id}")
    public ResponseEntity<List<GatePassRequest>> getPendingWarden(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getPendingRequestsForWarden(id));
    }
    @GetMapping("/history/tutor/{id}")
    public ResponseEntity<List<GatePassRequest>> getHistoryTutor(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getHistoryForTutor(id));
    }
    @GetMapping("/history/warden/{id}")
    public ResponseEntity<List<GatePassRequest>> getHistoryWarden(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getHistoryForWarden(id));
    }
    @PostMapping("/approve/{id}")
    public ResponseEntity<GatePassRequest> approve(@PathVariable Long id, @RequestParam String role) { return ResponseEntity.ok(gatePassService.approveRequest(id, role)); }
    @PostMapping("/reject/{id}")
    public ResponseEntity<GatePassRequest> reject(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.rejectRequest(id));
    }
    @PostMapping("/modify/{id}")
    public ResponseEntity<GatePassRequest> modify(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.modifyApproval(id));
    }
    @GetMapping("/student/{id}")
    public ResponseEntity<List<GatePassRequest>> getByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(gatePassService.getRequestsByStudentId(id));
    }
    @DeleteMapping("/request/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gatePassService.deleteRequest(id); return ResponseEntity.ok().build();
    }
}