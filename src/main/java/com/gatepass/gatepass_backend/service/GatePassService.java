package com.gatepass.gatepass_backend.service;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.repository.GatePassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatePassService {

    @Autowired
    private GatePassRequestRepository requestRepository;

    public GatePassRequest createRequest(GatePassRequest request) {
        request.setStatus("PENDING_TUTOR_APPROVAL");
        return requestRepository.save(request);
    }

    public List<GatePassRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public GatePassRequest approveRequest(Long requestId, String approverRole, Long approverId) {
        GatePassRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if ("TUTOR".equalsIgnoreCase(approverRole)) {
            if (!"PENDING_TUTOR_APPROVAL".equals(request.getStatus())) {
                throw new RuntimeException("Request is not pending tutor approval.");
            }
            request.setStatus("PENDING_WARDEN_APPROVAL");
            request.setTutorId(approverId);
        } else if ("WARDEN".equalsIgnoreCase(approverRole)) {
            if (!"PENDING_WARDEN_APPROVAL".equals(request.getStatus())) {
                throw new RuntimeException("Request is not pending warden approval.");
            }
            request.setStatus("APPROVED");
            request.setWardenId(approverId);
        } else {
            throw new RuntimeException("Invalid approver role.");
        }

        return requestRepository.save(request);
    }
}