package com.gatepass.gatepass_backend.service;

import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.repository.GatePassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class GatePassService {

    @Autowired
    private GatePassRequestRepository requestRepository;

    public GatePassRequest createRequest(GatePassRequest request) {
        request.setStatus("PENDING_TUTOR_APPROVAL");
        return requestRepository.save(request);
    }

    public List<GatePassRequest> getPendingTutorRequests(Long tutorId) {
        return requestRepository.findByStatusAndTutorId("PENDING_TUTOR_APPROVAL", tutorId);
    }

    public List<GatePassRequest> getPendingWardenRequests(Long wardenId) {
        return requestRepository.findByStatusAndWardenId("PENDING_WARDEN_APPROVAL", wardenId);
    }

    public GatePassRequest approveRequest(Long requestId, String approverRole, Long approverId) {
        GatePassRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if ("TUTOR".equalsIgnoreCase(approverRole)) {
            request.setStatus("PENDING_WARDEN_APPROVAL");
            request.setTutorId(approverId);
        } else if ("WARDEN".equalsIgnoreCase(approverRole)) {
            request.setStatus("APPROVED");
            request.setWardenId(approverId);
        }
        return requestRepository.save(request);
    }

    public GatePassRequest rejectRequest(Long requestId) {
        GatePassRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("REJECTED");
        return requestRepository.save(request);
    }

    public List<GatePassRequest> getRequestsByStudentId(Long studentId) {
        return requestRepository.findByStudentId(studentId);
    }
    public List<GatePassRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }
    public void deleteRequest(Long requestId) {
        GatePassRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));

        // Optional: Add a rule that only pending requests can be deleted
        if (!"PENDING_TUTOR_APPROVAL".equals(request.getStatus())) {
            throw new RuntimeException("Only requests pending tutor approval can be deleted.");
        }

        requestRepository.delete(request);
    }
    public List<GatePassRequest> getTutorHistory(Long tutorId) {
        return requestRepository.findByTutorIdAndStatusIn(tutorId, Arrays.asList("PENDING_WARDEN_APPROVAL", "APPROVED", "REJECTED"));
    }

    public List<GatePassRequest> getWardenHistory(Long wardenId) {
        return requestRepository.findByWardenIdAndStatus(wardenId, "APPROVED");
    }

    // ** NEW METHOD FOR MODIFYING APPROVAL **
    public GatePassRequest modifyApproval(Long requestId, String role) {
        GatePassRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if ("TUTOR".equalsIgnoreCase(role) && "PENDING_WARDEN_APPROVAL".equals(request.getStatus())) {
            request.setStatus("PENDING_TUTOR_APPROVAL");
        } else if ("WARDEN".equalsIgnoreCase(role) && "APPROVED".equals(request.getStatus())) {
            request.setStatus("PENDING_WARDEN_APPROVAL");
        } else {
            throw new RuntimeException("This request status cannot be modified by you at this time.");
        }
        return requestRepository.save(request);
    }
}