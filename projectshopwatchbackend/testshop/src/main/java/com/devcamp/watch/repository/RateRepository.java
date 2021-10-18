package com.devcamp.watch.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.Rate;

public interface RateRepository extends JpaRepository<Rate, Long> {
	
	@Query(value = "SELECT * FROM rates WHERE customer_id = :customerId", nativeQuery = true)
	List<Rate> listRateByCustomerId(@Param("customerId") int customerId);
	
	@Query(value = "SELECT * FROM rates WHERE orderdetails_id = :orderdetailId", nativeQuery = true)
	Rate rateByOrderDetailId(@Param("orderdetailId") int orderdetailId);
	
	@Query(value = "SELECT * FROM rates WHERE product_id = :productId", nativeQuery = true)
	List<Rate> listRateByProductId(@Param("productId") int productId);
}
