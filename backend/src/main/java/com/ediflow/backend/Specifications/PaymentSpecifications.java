package com.ediflow.backend.Specifications;
import com.ediflow.backend.entity.Payment;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;

public class PaymentSpecifications {

    public static Specification<Payment> hasStatus(String status) {
        return (root, query, builder) -> {
            if (status == null || status.isEmpty()) return null;
            return builder.equal(root.get("status"), status);
        };
    }

    public static Specification<Payment> hasBuildingId(Long buildingId) {
        return (root, query, builder) -> {
            if (buildingId == null) return null;
            // Asumiendo que Payment -> Resident -> Building
            Join<Object, Object> resident = root.join("resident");
            Join<Object, Object> apartment = resident.join("apartment");
            Join<Object, Object> building = apartment.join("building");
            return builder.equal(building.get("id"), buildingId);
        };
    }

    public static Specification<Payment> issueDateBetween(LocalDate fromDate, LocalDate toDate) {
        return (root, query, builder) -> {
            if (fromDate == null && toDate == null) return null;
            if (fromDate != null && toDate != null) {
                return builder.between(root.get("issueDate"), fromDate, toDate);
            } else if (fromDate != null) {
                return builder.greaterThanOrEqualTo(root.get("issueDate"), fromDate);
            } else {
                return builder.lessThanOrEqualTo(root.get("issueDate"), toDate);
            }
        };
    }
}
