package com.ediflow.backend.controller;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.service.ICommonAreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/common-areas")
public class CommonAreaController {

    @Autowired
    private ICommonAreaService commonAreaService;

    @PostMapping("/create")
    public ResponseEntity<CommonAreaDTO> createCommonArea(@RequestBody @Valid CommonAreaDTO commonAreaDTO) {
        CommonAreaDTO created = commonAreaService.create(commonAreaDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CommonAreaDTO>> getAllCommonAreas() {
        List<CommonAreaDTO> areas = commonAreaService.findAll();
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommonAreaDTO> getCommonAreaById(@PathVariable Long id) {
        CommonAreaDTO dto = commonAreaService.findById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CommonAreaDTO> updateCommonArea(@PathVariable Long id, @RequestBody @Valid CommonAreaDTO dto) {
        CommonAreaDTO updated = commonAreaService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCommonArea(@PathVariable Long id) {
        commonAreaService.delete(id);
        return ResponseEntity.ok("Área común eliminada correctamente");
    }
}
