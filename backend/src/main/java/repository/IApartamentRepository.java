package repository;

import model.Apartament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IApartamentRepository extends JpaRepository<Apartament, Long> {
}
