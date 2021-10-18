package com.devcamp.watch.repository;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.OrderDetails;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long>{

	@Query(value="SELECT * FROM order_details WHERE order_id like %:orderId%", nativeQuery = true)
	List<OrderDetails> findOrderDetailByOrderId(@Param("orderId") Long orderId);
	
	@Query(value="SELECT * FROM order_details WHERE product_id like %:productId% ORDER BY product_id DESC", nativeQuery = true)
	List<OrderDetails> findOrderDetailProductId(@Param("productId") Long productId);
}
