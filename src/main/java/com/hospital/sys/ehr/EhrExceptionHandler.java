package com.hospital.sys.ehr;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// Restricts this exception handler ONLY to controllers inside the ehr package
@RestControllerAdvice(basePackages = "com.hospital.sys.ehr")
public class EhrExceptionHandler {

    // Handles "record not found" cases -> 404
    @ExceptionHandler(MedicalRecordNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(MedicalRecordNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    // Handles bad/invalid data hitting the DB (e.g. null required fields) -> 400
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request",
                "Invalid data: a required field may be missing or malformed.");
    }

    // Fallback for anything else unexpected -> 500
    // Kept separate and last so it never masks the two specific cases above.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(RuntimeException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", status.value());
        response.put("error", error);
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }
}