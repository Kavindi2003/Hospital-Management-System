package com.hospital.sys.ehr;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EhrServiceTest {

    @Mock
    private EhrRepository ehrRepository; // Replace with your actual repository interface

    @InjectMocks
    private EhrService ehrService; // Injects mocked repository into service instance

    @Test
    void findById_WhenRecordExists_ShouldReturnRecord() {
        // Arrange
        Long id = 1L;
        // Mock repository response
        when(ehrRepository.findById(id)).thenReturn(Optional.of("Sample Record"));

        // Act
        Object result = ehrService.getRecordById(id);

        // Assert
        assertNotNull(result);
        verify(ehrRepository, times(1)).findById(id);
    }
}