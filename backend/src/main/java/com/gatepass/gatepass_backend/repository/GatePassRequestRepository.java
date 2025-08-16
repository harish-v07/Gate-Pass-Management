package com.gatepass.gatepass_backend.repository;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GatePassRequestRepository extends JpaRepository<GatePassRequest, Long> {
    // Modified methods to fetch requests assigned to a specific person
    List<GatePassRequest> findByStatusAndTutorId(String status, Long tutorId);
    List<GatePassRequest> findByStatusAndWardenId(String status, Long wardenId);
    List<GatePassRequest> findByStudentId(Long studentId);
    List<GatePassRequest> findByStatus(String status);
    List<GatePassRequest> findByTutorIdAndStatusIn(Long tutorId, List<String> statuses);
    List<GatePassRequest> findByWardenIdAndStatus(Long wardenId, String status);
}