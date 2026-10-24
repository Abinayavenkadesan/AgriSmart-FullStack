
package com.agrismart.crop;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IrrigationLogRepository
        extends JpaRepository<IrrigationLog, Long> {
}
