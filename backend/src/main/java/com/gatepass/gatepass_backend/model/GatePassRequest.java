package com.gatepass.gatepass_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_pass_request")
@Data
public class GatePassRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String mobileNumber;
    private String department;
    private int year;
    private String classSection;
    private String purpose;
    private String status;

    private Long tutorId;
    private Long wardenId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}