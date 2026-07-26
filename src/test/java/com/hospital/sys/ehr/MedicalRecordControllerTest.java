package com.hospital.sys.ehr;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EhrController.class) // Replace EhrController with your actual controller class name
class EhrControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EhrService ehrService; // Replace with your actual service class name

    @Test
    void getRecordById_ShouldReturnOk() throws Exception {
        // Arrange
        Long recordId = 1L;
        // Adjust returned mock data according to your model
        when(ehrService.getRecordById(recordId)).thenReturn("Sample Medical Record");

        // Act & Assert
        mockMvc.perform(get("/api/ehr/" + recordId) // Adjust to your actual endpoint mapping
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Sample Medical Record"));
    }
}