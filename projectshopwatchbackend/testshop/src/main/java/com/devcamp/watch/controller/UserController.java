package com.devcamp.watch.controller;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.devcamp.watch.model.User;
import com.devcamp.watch.repository.UserRepository;


@CrossOrigin
@RestController
@RequestMapping("/")
public class UserController {
	@Autowired
	private UserRepository puserRepository;

	@GetMapping("/user")
	public List<User> getAllUser(){
		try {
			return puserRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/user/{id}")
	public ResponseEntity<Object> getUserById(@PathVariable("id") Long id){
		try {
			Optional<User> userData = puserRepository.findById(id);
			if(userData.isPresent()) {
				return new ResponseEntity<>(userData.get(), HttpStatus.FOUND);
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/user")
	public ResponseEntity<Object> createUser(@RequestBody User user){
		try {
			User newUser = new User();
			newUser.setUsername(user.getUsername());
			newUser.setPassword(user.getPassword());
			newUser.setLevel(user.getLevel());
			newUser.setPhoneNumber(user.getPhoneNumber());
			
			User saveUser = puserRepository.save(newUser);
			return new ResponseEntity<>(saveUser, HttpStatus.CREATED);
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PutMapping("/user/{id}")
	public ResponseEntity<Object> updateUser(@PathVariable("id") Long id, @RequestBody User user){
		try {
			Optional<User> userData = puserRepository.findById(id);
			if(userData.isPresent()) {
				User newUser = userData.get();
				
				newUser.setUsername(user.getUsername());
				newUser.setPhoneNumber(user.getPhoneNumber());
				
				User saveUser = puserRepository.save(newUser);
				return new ResponseEntity<>(saveUser, HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
			
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@DeleteMapping("/user/{id}")
	public ResponseEntity<Object> deleteUser(@PathVariable("id") Long id){
		try {
			puserRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/user/userbyusername/{username}/{password}")
	public ResponseEntity<Object> getUserByUserName(@PathVariable("username") String username, @PathVariable("password") String passwork){
		User userData = puserRepository.findUserbyUserName(username, passwork);
		if(userData != null) {
			try {
				return new ResponseEntity<>(userData, HttpStatus.OK);
			} catch (Exception e) {
				return ResponseEntity.unprocessableEntity()
						.body("Failed to Update specified UserData:" + e.getCause().getCause().getMessage());
			}
		}
		else {
			return ResponseEntity.badRequest().body("Failed to get specified UserData");
		}
	}
	
	@GetMapping("/user/userbyphonenumber/{phoneNumber}")
	public ResponseEntity<Object> getUserByPhoneNumber(@Valid @PathVariable("phoneNumber") String phoneNumber) {
		User userData = puserRepository.findUserbyPhoneNumber(phoneNumber);
		if (userData != null) {
			try {
				return new ResponseEntity<>(userData, HttpStatus.OK);
			} catch (Exception e) {
				return ResponseEntity.unprocessableEntity()
						.body("Failed to Update specified UserData:" + e.getCause().getCause().getMessage());
			}
		} else {
			return ResponseEntity.badRequest().body("Failed to get specified UserData");
		}
	}
	
	
	
}
