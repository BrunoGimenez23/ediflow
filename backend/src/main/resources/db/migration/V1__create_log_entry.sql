-- V__create_log_entry.sql
CREATE TABLE log_entry (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL,
  created_by_id BIGINT,
  resident_id BIGINT,
  building_id BIGINT,
  CONSTRAINT fk_logentry_createdby FOREIGN KEY (created_by_id) REFERENCES user(id),
  CONSTRAINT fk_logentry_resident FOREIGN KEY (resident_id) REFERENCES resident(id),
  CONSTRAINT fk_logentry_building FOREIGN KEY (building_id) REFERENCES building(id)
);
