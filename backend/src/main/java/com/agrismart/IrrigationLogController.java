
package com.agrismart.crop;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/irrigation-logs")
@CrossOrigin(origins = "http://localhost:5173")
public class IrrigationLogController {

    private final IrrigationLogRepository repository;

    public IrrigationLogController(
            IrrigationLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<IrrigationLog> getAllLogs() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IrrigationLog addLog(
            @RequestBody IrrigationLog log) {

        log.setId(null);

        return repository.save(log);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLog(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Irrigation log not found");
        }

        repository.deleteById(id);
    }
}
