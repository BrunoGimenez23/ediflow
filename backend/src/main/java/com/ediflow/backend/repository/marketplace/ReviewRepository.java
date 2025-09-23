package com.ediflow.backend.repository.marketplace;

import com.ediflow.backend.entity.marketplace.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderId(Long providerId);
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.providerId = :providerId")
    Double findAverageRatingByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.providerId = :providerId")
    Integer countReviewsByProviderId(@Param("providerId") Long providerId);
}
