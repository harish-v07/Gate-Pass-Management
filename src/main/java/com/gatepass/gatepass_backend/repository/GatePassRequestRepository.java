package com.gatepass.gatepass_backend.repository;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GatePassRequestRepository extends JpaRepository<GatePassRequest, Long> {
    List<GatePassRequest> findByStatus(String status);
}