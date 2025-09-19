package com.gatepass.gatepass_backend.service;
import com.gatepass.gatepass_backend.model.GatePassRequest;
import com.gatepass.gatepass_backend.repository.GatePassRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GatePassService {
    @Autowired
    private GatePassRequestRepository gatePassRequestRepository;
    public GatePassRequest createRequest(GatePassRequest r) {
        r.setStatus("PENDING_TUTOR_APPROVAL");
        return gatePassRequestRepository.save(r);
    }
    public List<GatePassRequest> getRequestsByStatus(String s) {
        return gatePassRequestRepository.findByStatus(s);
    }
    public List<GatePassRequest> getPendingRequestsForTutor(Long id) {
        return gatePassRequestRepository.findByTutorIdAndStatus(id, "PENDING_TUTOR_APPROVAL");
    }
    public List<GatePassRequest> getPendingRequestsForWarden(Long id) {
        return gatePassRequestRepository.findByWardenIdAndStatus(id, "PENDING_WARDEN_APPROVAL");
    }
    public List<GatePassRequest> getHistoryForTutor(Long id) {
        return gatePassRequestRepository.findByTutorId(id).stream().filter(r -> !r.getStatus().equals("PENDING_TUTOR_APPROVAL")).collect(Collectors.toList());
    }
    public List<GatePassRequest> getHistoryForWarden(Long id) {
        return gatePassRequestRepository.findByWardenId(id).stream().filter(r -> !r.getStatus().equals("PENDING_WARDEN_APPROVAL")).collect(Collectors.toList());
    }
    public GatePassRequest approveRequest(Long id, String role) {
        GatePassRequest r = gatePassRequestRepository.findById(id).orElseThrow();
        if (role.equals("TUTOR"))
            r.setStatus("PENDING_WARDEN_APPROVAL");
        else if (role.equals("WARDEN"))
            r.setStatus("APPROVED");
        return gatePassRequestRepository.save(r);
    }
    public GatePassRequest rejectRequest(Long id) {
        GatePassRequest r = gatePassRequestRepository.findById(id).orElseThrow();
        r.setStatus("REJECTED"); return gatePassRequestRepository.save(r);
    }
    public GatePassRequest modifyApproval(Long id) {
        GatePassRequest r = gatePassRequestRepository.findById(id).orElseThrow();
        if (r.getStatus().equals("APPROVED"))
            r.setStatus("PENDING_WARDEN_APPROVAL");
        else if (r.getStatus().equals("PENDING_WARDEN_APPROVAL"))
            r.setStatus("PENDING_TUTOR_APPROVAL");
        return gatePassRequestRepository.save(r); }
    public List<GatePassRequest> getRequestsByStudentId(Long id) {
        return gatePassRequestRepository.findByStudentId(id);
    }
    public void deleteRequest(Long id) {
        GatePassRequest r = gatePassRequestRepository.findById(id).orElseThrow();
        if (!"PENDING_TUTOR_APPROVAL".equals(r.getStatus()))
            throw new IllegalStateException("Cannot delete a request that has already been processed.");
        gatePassRequestRepository.deleteById(id);
    }
}