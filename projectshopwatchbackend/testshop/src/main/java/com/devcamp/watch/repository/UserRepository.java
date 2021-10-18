package com.devcamp.watch.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import com.devcamp.watch.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

	@Query(value = "SELECT * FROM users WHERE username = :username AND password = :password", nativeQuery = true)
	User findUserbyUserName(@Param("username") String username, @Param("password") String password);
	
	@Query(value = "SELECT * FROM users WHERE phone_number = :phoneNumber", nativeQuery = true)
	User findUserbyPhoneNumber(@Param("phoneNumber") String phoneNumber);
}
