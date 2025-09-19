package com.gatepass.gatepass_backend.repository;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GatePassRequestRepository extends JpaRepository<GatePassRequest, Long> {
    List<GatePassRequest> findByStatus(String status);
    List<GatePassRequest> findByStudentId(Long studentId);
    List<GatePassRequest> findByTutorIdAndStatus(Long tutorId, String status);
    List<GatePassRequest> findByWardenIdAndStatus(Long wardenId, String status);
    List<GatePassRequest> findByTutorId(Long tutorId);
    List<GatePassRequest> findByWardenId(Long wardenId);
}