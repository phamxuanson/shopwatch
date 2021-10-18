package com.devcamp.watch.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.Products;

public interface ProductRepository extends JpaRepository<Products, Long>{

	@Query(value = "SELECT * FROM products  WHERE product_code like :code", nativeQuery = true)
	List<Products> findProductByProductCode(@Param("code") String code);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE products SET quantity_in_stock = :quantity WHERE quantity_in_stock IS NULL", nativeQuery = true)
	int updateProductWithQuantity(/*@Param("countryTim") String countryTim,*/ @Param("quantity") String quantity);
	
	@Query(value = "SELECT * FROM products ORDER BY product_name ASC LIMIT 8", nativeQuery = true)
	List<Products> listProductlimit8();
	
	// ========================================== all product ================================================
	/**
	 * @param pageable
	 * @return list all product with Paging
	 */
	@Query(value = "SELECT * FROM products", nativeQuery = true)
	List<Products> listProductPageable(Pageable pageable);
	
	// ========================================== filter product ================================================
	
	@Query(value="SELECT * FROM products WHERE product_vendor IN (:vendor)", nativeQuery = true)
	List<Products> getListProductByFilter(@Param("vendor") String[] vendor, Pageable pageable);
	
	// kiểu số
	//		SELECT * FROM products
	//		WHERE (product_vendor IN (:vendor) OR :vendor IS NULL)
	//		AND (buy_price >= :price_min OR :price_min IS NULL)
	//		AND (buy_price <= :price_max OR :price_max IS NULL)
	
	@Query(value="SELECT * FROM products WHERE (product_vendor IN :vendor OR COALESCE(:vendor) IS NULL) AND (CAST(buy_price AS DECIMAL) >= :price_min OR :price_min IS NULL) AND (CAST(buy_price AS DECIMAL) <= :price_max OR :price_max IS NULL)", nativeQuery = true)
	List<Products> getListProductByFilter(@Param("vendor") List<String> vendor, @Param("price_min") String price_min, @Param("price_max") String price_max, Pageable pageable);
	
	
	
	// ========================================== product by product line ================================================
	/**
	 * @param productLineId
	 * @param pageable
	 * @return List product by product line id
	 */
	@Query(value = "SELECT * FROM products WHERE product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByProductLinePageable(@Param("productLineId") int productLineId, Pageable pageable);
	
	/**
	 * @param productLineId
	 * @return length List product by product line id by controller
	 */
	@Query(value = "SELECT * FROM products WHERE product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByProductLinePageable(@Param("productLineId") int productLineId);
	
	// ============================== product by vendor and product line =============================//
	// độ dài
	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByVendorAndProductLine(@Param("productVendor") String productVendor, @Param("productLineId") int productLineId);
	
	//phân trang
	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByVendorAndProductLine(@Param("productVendor") String productVendor, @Param("productLineId") int productLineId, Pageable pageable);
		
	// =============================== product by price from 0 to price and product line =====================//
	
	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByPriceDownAndProductLine(@Param("buyPrice") int buyPrice, @Param("productLineId") int productLineId, Pageable pageable);
	
	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByPriceDownAndProductLine(@Param("buyPrice") int buyPrice, @Param("productLineId") int productLineId);
	
	// ========================================== product by price to max price and product line ================================================
	
	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByPriceUpAndProductLine(@Param("buyPrice") int buyPrice, @Param("productLineId") int productLineId, Pageable pageable);

	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByPriceUpAndProductLine(@Param("buyPrice") int buyPrice, @Param("productLineId") int productLineId);
		
	// ========================================== product by price to max price, vendor and product line ================================================
	
	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice AND product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByPriceUpVendorProductLine(@Param("productVendor") String productVendor, @Param("buyPrice") int buyPrice,
			@Param("productLineId") int productLineId, Pageable pageable);
	
	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice AND product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByPriceUpVendorProductLine(@Param("productVendor") String productVendor, @Param("buyPrice") int buyPrice,
			@Param("productLineId") int productLineId);
	
	// ========================================== product by price from 0 to price, vendor and product line ================================================
	
	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice AND product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> listProductByPriceDownVendorProductLine(@Param("productVendor") String productVendor, @Param("buyPrice") int buyPrice,
			@Param("productLineId") int productLineId, Pageable pageable);
	
	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice AND product_vendor = :productVendor AND product_line_id = :productLineId", nativeQuery = true)
	List<Products> lengthProductByPriceDownVendorProductLine(@Param("productVendor") String productVendor, @Param("buyPrice") int buyPrice,
			@Param("productLineId") int productLineId);
	
	// ========================================== price from 0 to "buyPrice"==================================================================================
	
	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice", nativeQuery = true)
	List<Products> listProductByBuyPriceDown(@Param("buyPrice") int buyPrice, Pageable pageable);

	@Query(value = "SELECT * FROM products WHERE buy_price <= :buyPrice", nativeQuery = true)
	List<Products> lengthProductByBuyPriceDown(@Param("buyPrice") int buyPrice);
	
	// ========================================== price from price to max price ================================================

	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice", nativeQuery = true)
	List<Products> listProductByBuyPriceUp(@Param("buyPrice") int buyPrice, Pageable pageable);

	@Query(value = "SELECT * FROM products WHERE buy_price >= :buyPrice", nativeQuery = true)
	List<Products> lengthProductByBuyPriceUp(@Param("buyPrice") int buyPrice);
	
	// ==========================================vendor and price from price to max price ================================================

	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND buy_price >= :buyPrice", nativeQuery = true)
	List<Products> listProductByVendorPriceUp(@Param("productVendor") String productVendor,
			@Param("buyPrice") int buyPrice, Pageable pageable);
	
	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND buy_price >= :buyPrice", nativeQuery = true)
	List<Products> lengthProductByVendorPriceUp(@Param("productVendor") String productVendor,
			@Param("buyPrice") int buyPrice);
	
	// ==========================================vendor and price from 0 to price ================================================

	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND buy_price <= :buyPrice", nativeQuery = true)
	List<Products> listProductByVendorPriceDown(@Param("productVendor") String productVendor,
			@Param("buyPrice") int buyPrice, Pageable pageable);
	
	@Query(value = "SELECT * FROM products WHERE product_vendor = :productVendor AND buy_price <= :buyPrice", nativeQuery = true)
	List<Products> lengthProductByVendorPriceDown(@Param("productVendor") String productVendor,
			@Param("buyPrice") int buyPrice);
}

