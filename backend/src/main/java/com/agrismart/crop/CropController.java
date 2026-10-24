package com.agrismart.crop;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/crops")
public class CropController {
    private final CropRepository repository;

    public CropController(CropRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Crop> getAll(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) return repository.findAll();
        return repository.findByNameContainingIgnoreCaseOrVarietyContainingIgnoreCase(search, search);
    }

    @GetMapping("/{id}")
    public Crop getOne(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Crop create(@Valid @RequestBody Crop crop) {
        crop.setId(null);
        return repository.save(crop);
    }

    @PutMapping("/{id}")
    public Crop update(@PathVariable Long id, @Valid @RequestBody Crop input) {
        Crop crop = getOne(id);
        crop.setName(input.getName());
        crop.setVariety(input.getVariety());
        crop.setArea(input.getArea());
        crop.setStage(input.getStage());
        crop.setWater(input.getWater());
        crop.setHealth(input.getHealth());
        return repository.save(crop);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found");
        }
        repository.deleteById(id);
    }
}
