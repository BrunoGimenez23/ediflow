package com.ediflow.backend.controller;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.service.ICommonAreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/common-areas")
public class CommonAreaController {

    @Autowired
    private ICommonAreaService commonAreaService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SUPPORT')")
    @PostMapping("/create")
    public ResponseEntity<CommonAreaDTO> createCommonArea(@RequestBody @Valid CommonAreaDTO commonAreaDTO) {
        CommonAreaDTO created = commonAreaService.create(commonAreaDTO);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/all")
    public ResponseEntity<List<CommonAreaDTO>> getAllCommonAreas(
            @RequestParam(required = false) Long adminAccountId,
            @RequestParam(required = false) Long adminId
    ) {
        List<CommonAreaDTO> areas = commonAreaService.findAllFiltered();
        return ResponseEntity.ok(areas);
    }


    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<CommonAreaDTO> getCommonAreaById(@PathVariable Long id) {
        CommonAreaDTO dto = commonAreaService.findById(id);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SUPPORT')")
    @PutMapping("/update/{id}")
    public ResponseEntity<CommonAreaDTO> updateCommonArea(@PathVariable Long id, @RequestBody @Valid CommonAreaDTO dto) {
        CommonAreaDTO updated = commonAreaService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SUPPORT')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCommonArea(@PathVariable Long id) {
        commonAreaService.delete(id);
        return ResponseEntity.ok("Área común eliminada correctamente");
    }
}