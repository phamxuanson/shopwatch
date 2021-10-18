package com.devcamp.watch.repository;


import java.util.*;

import javax.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.Customers;

public interface CustomerRepository extends JpaRepository<Customers, Long> {

	
	/**
	 * tìm customer với tên
	 * @param fname
	 * @return 1 customer hoặc danh sách customer
	 */
	@Query(value="SELECT * FROM customers WHERE first_name like %:fname% ", nativeQuery = true)
	List<Customers> findCustomerByFirstName(@Param("fname") String fname);
	
	/**
	 * tìm customer với tên
	 * @param fname
	 * @return 1 customer hoặc danh sách customer
	 */
	@Query(value="SELECT * FROM customers WHERE last_name like %:lname% ", nativeQuery = true)
	List<Customers> findCustomerByLastName(@Param("lname") String lname);
	
	
	/**
	 * Tìm customer bằng city
	 * @param city
	 * @param pageable
	 * @return danh sách customer
	 */
	@Query(value="SELECT * FROM customers WHERE city like %:city% ORDER BY last_name DESC", nativeQuery = true)
	List<Customers> findCustomerByCityLike(@Param("city") String city,  Pageable pageable);
	
	/**
	 * Tìm customer bằng state
	 * @param state
	 * @param pageable
	 * @return danh sách customer
	 */
	@Query(value="SELECT * FROM customers WHERE state like %:state%", nativeQuery = true)
	List<Customers> findCustomerByStateLike(@Param("state") String state,  Pageable pageable);
	
	/**
	 *  Tìm customer bằng country
	 * @param country
	 * @param pageable
	 * @return danh sách customer có phân trang
	 */
	@Query(value="SELECT * FROM customers WHERE country like :country ORDER BY country DESC", nativeQuery = true)
	List<Customers> findCustomerByCountryLike(@Param("country") String country,  Pageable pageable);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE customers SET country = :countr WHERE country IS NULL", nativeQuery = true)
	int updateCountry(@Param("countr") String country);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE customers SET country = :countr WHERE country = :country", nativeQuery = true)
	int updateCountries(@Param("countr") String country, @Param("country") String countries);
	
	@Query(value = "SELECT * FROM customers WHERE phone_number = :phone", nativeQuery = true)
	List<Customers> findCustomerByPhoneNumber(@Param("phone") String phone);
	
	Optional<Customers> findByPhoneNumber(String phoneNumber);
	
//	@Query(value="SELECT * FROM customers WHERE phone_number = :phoneNumber" , nativeQuery = true)
//	Optional<Customers> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
	
	// ================== theo rank customer ================//
	
	@Query(value="SELECT CONCAT(c.last_name, ' ' ,c.first_name) AS full_name, SUM(od.price_each * od.quantity_order) AS total_money FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING total_money > 50000000", nativeQuery = true)
	List<Object> listCustomerPlatinum();
	
	@Query(value="SELECT CONCAT(c.last_name, ' ' ,c.first_name) AS full_name, SUM(od.price_each * od.quantity_order) AS total_money FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING total_money > 20000000 AND total_money < 50000000", nativeQuery = true)
	List<Object> listCustomerGold();
	
	@Query(value="SELECT CONCAT(c.last_name, ' ' ,c.first_name) AS full_name, SUM(od.price_each * od.quantity_order) AS total_money FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING total_money > 10000000 AND total_money < 20000000", nativeQuery = true)
	List<Object> listCustomerSilver();
	
	@Query(value="SELECT CONCAT(c.last_name, ' ' ,c.first_name) AS full_name, SUM(od.price_each * od.quantity_order) AS total_money FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING total_money > 5000000 AND total_money < 10000000", nativeQuery = true)
	List<Object> listCustomerVip();
	
	@Query(value="SELECT CONCAT(c.last_name, ' ' ,c.first_name) AS full_name, COUNT(o.id) AS total_order FROM orders AS o JOIN customers AS c ON c.id = o.customer_id GROUP BY full_name HAVING total_order = :totalOrder", nativeQuery = true)
	List<Object> listCustomerByTotalOrder(@Param("totalOrder") int totalOrder);
	
	// =================== theo rank excel ====================//
	
	@Query(value="SELECT c.id as id, c.phone_number as phoneNumber, c.address as address, c.first_name as firstName, c.last_name as lastName, c.city as city, c.state as state, c.email as email, SUM(od.price_each * od.quantity_order) AS totalMoney FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING totalMoney > 50000000", nativeQuery = true)
	List<ICustomerLevel> listCustomerPlatinumExport();
	
	@Query(value="SELECT c.id as id, c.phone_number as phoneNumber, c.address as address, c.first_name as firstName, c.last_name as lastName, c.city as city, c.state as state, c.email as email, SUM(od.price_each * od.quantity_order) AS totalMoney FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING totalMoney > 20000000 AND totalMoney < 50000000", nativeQuery = true)
	List<ICustomerLevel> listCustomerGoldExport();
	
	@Query(value="SELECT c.id as id, c.phone_number as phoneNumber, c.address as address, c.first_name as firstName, c.last_name as lastName, c.city as city, c.state as state, c.email as email, SUM(od.price_each * od.quantity_order) AS totalMoney FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING totalMoney > 10000000 AND totalMoney < 20000000", nativeQuery = true)
	List<ICustomerLevel> listCustomerSilverExport();
	
	@Query(value="SELECT c.id as id, c.phone_number as phoneNumber, c.address as address, c.first_name as firstName, c.last_name as lastName, c.city as city, c.state as state, c.email as email, SUM(od.price_each * od.quantity_order) AS totalMoney FROM order_details AS od JOIN orders AS o ON o.id = od.order_id JOIN customers AS c on c.id = o.customer_id GROUP BY o.customer_id HAVING totalMoney > 5000000 AND totalMoney < 10000000", nativeQuery = true)
	List<ICustomerLevel> listCustomerVipExport();
	
	@Query(value="SELECT c.id as id, c.phone_number as phoneNumber, c.address as address, c.city as city, c.state as state, c.last_name as lastName, c.first_name as firstName, c.email as email, COUNT(o.id) AS totalOrder FROM orders AS o JOIN customers AS c ON c.id = o.customer_id GROUP BY o.customer_id HAVING totalOrder = :totalOrder", nativeQuery = true)
	List<ICustomerTotalOrder> listCustomerByTotalOrderExport(@Param("totalOrder") int totalOrder);
	
}
