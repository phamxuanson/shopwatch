package com.devcamp.watch.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.ProductLine;
import com.devcamp.watch.model.Products;

public interface ProductLineRepository extends JpaRepository<ProductLine, Long>{

	@Query(value="SELECT * FROM product_line WHERE product_line like %:productLine%", nativeQuery = true)
	List<Products> findProductByLineProductLine(@Param("productLine") String productLine);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE product_line SET description = :descriptionNhap WHERE description IS NULL", nativeQuery = true)
	int updateProductLineWithDescription(/*@Param("countryTim") String countryTim,*/ @Param("descriptionNhap") String descriptionNhap);
}
