package com.devcamp.watch.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.watch.model.Customers;
import com.devcamp.watch.model.User;
import com.devcamp.watch.repository.CustomerRepository;
import com.devcamp.watch.repository.ICustomerLevel;
import com.devcamp.watch.repository.ICustomerTotalOrder;
import com.devcamp.watch.repository.UserRepository;
import com.devcamp.watch.service.ExcelExporterCustomerLevel;
import com.devcamp.watch.service.ExcelExporterCustomerTotalOrder;

@CrossOrigin
@Transactional
@RestController
@RequestMapping("/")
public class CustomerController {

	@Autowired
	CustomerRepository pCustomerRepository;
	
	@Autowired
	private UserRepository pUserRepository;
	
	@GetMapping("/customers")
	public List<Customers> getAllCustomer(){
		try {
			return pCustomerRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/customers/{id}")
	public ResponseEntity<Object> getCustomerById(@PathVariable("id") Long id){
		try {
			Optional<Customers> customerData = pCustomerRepository.findById(id);
			if(customerData.isPresent()) {
				return new ResponseEntity<>(customerData.get(), HttpStatus.FOUND);				
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/customers")
	public ResponseEntity<Object> createCustomer(@Valid @RequestBody Customers customer ){
		try {
			Customers newCustomer = new Customers();
			newCustomer.setFirstName(customer.getFirstName());
			newCustomer.setLastName(customer.getLastName());
			newCustomer.setPhoneNumber(customer.getPhoneNumber());
			newCustomer.setAddress(customer.getAddress());
			newCustomer.setCity(customer.getCity());
			newCustomer.setState(customer.getState());
			
			newCustomer.setEmail(customer.getEmail());
//			newCustomer.setOrders(customer.getOrders());
			
			
			Customers savedCustomer = pCustomerRepository.save(newCustomer);
			return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
		} catch (Exception e) {
			System.out.println("+++++++++++++++++++++::::: "+e.getCause().getCause().getMessage());
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified Customer: "+e.getCause().getCause().getMessage());
		}
	}
	
	@PostMapping("/customer/create")
	public ResponseEntity<Object> createCustomerByPhoneNumber(@RequestBody Customers customer){
		try {
			Optional<Customers> existCustomer = pCustomerRepository.findByPhoneNumber(customer.getPhoneNumber());
			
			if(existCustomer.isPresent()) {
				Customers newCustomer = existCustomer.get();
				
				newCustomer.setFirstName(customer.getFirstName());
				newCustomer.setLastName(customer.getLastName());
				newCustomer.setPhoneNumber(customer.getPhoneNumber());
				newCustomer.setAddress(customer.getAddress());
				newCustomer.setCity(customer.getCity());
				newCustomer.setState(customer.getState());
				newCustomer.setEmail(customer.getEmail());
				
				
				Customers saveCustomer = pCustomerRepository.save(newCustomer);
				return new ResponseEntity<>(saveCustomer , HttpStatus.OK);
			} else {
				Customers newCustomer = new Customers();
				newCustomer.setFirstName(customer.getFirstName());
				newCustomer.setLastName(customer.getLastName());
				newCustomer.setPhoneNumber(customer.getPhoneNumber());
				newCustomer.setAddress(customer.getAddress());
				newCustomer.setCity(customer.getCity());
				newCustomer.setState(customer.getState());
				newCustomer.setEmail(customer.getEmail());
				Customers saveCustomer = pCustomerRepository.save(newCustomer);
				return new ResponseEntity<>(saveCustomer , HttpStatus.CREATED);
			}
			
			
		} catch (Exception e) {
			// TODO: handle exception
			System.err.println("+++++++++:::::" + e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified customer: "+e);
		}
	}
	
	@PostMapping("/customer/createbyuserid/{userid}")
	public ResponseEntity<Object> createCustomerByUserId(@Valid @RequestBody Customers customer, @PathVariable("userid") Long userid) {
		Optional<User> userData = pUserRepository.findById(userid);
		if(userData.isPresent() ) {
			Customers newCustomer = new Customers();
			newCustomer.setLastName(customer.getLastName());
			newCustomer.setFirstName(customer.getFirstName());
			newCustomer.setPhoneNumber(customer.getPhoneNumber());
			newCustomer.setAddress(customer.getAddress());
			newCustomer.setEmail(customer.getEmail());
			newCustomer.setCity(customer.getCity());
			newCustomer.setState(customer.getState());
			
			User _user = userData.get();
			newCustomer.setUser(_user);
			
			Customers _customer = pCustomerRepository.save(newCustomer);
			try {
				return new ResponseEntity<>(_customer, HttpStatus.CREATED);

			} catch (Exception e) {
				System.out.println("+++++++++++++++++++++::::: " + e.getCause().getCause().getMessage());
				return ResponseEntity.unprocessableEntity()
						.body("Failed to Create specified Customer: " + e.getCause().getCause().getMessage());
			}
		}
		else {
			return ResponseEntity.badRequest().body("Failed to create Customer");
		}
		
	}
	
	@PutMapping("/customers/{id}")
	public ResponseEntity<Object> updateCustomer(@PathVariable("id") Long id, @RequestBody Customers customer){
		try {
			Optional<Customers> customerData = pCustomerRepository.findById(id);
			if (customerData.isPresent()) {
				Customers newCustomer = customerData.get();
				newCustomer.setLastName(customer.getLastName());
				newCustomer.setFirstName(customer.getFirstName());
				newCustomer.setPhoneNumber(customer.getPhoneNumber());
				newCustomer.setAddress(customer.getAddress());
				newCustomer.setCity(customer.getCity());
				newCustomer.setState(customer.getState());				
				
				newCustomer.setEmail(customer.getEmail());
		
				Customers saveCustomer = pCustomerRepository.save(newCustomer);
				return new ResponseEntity<>(saveCustomer, HttpStatus.OK);			
			}
			else {
				return new ResponseEntity<>( HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return ResponseEntity.unprocessableEntity()
					.body("Failed to Update specified Customer:" + e.getCause().getCause().getMessage());
		}
	}
	
	@Transactional
	@DeleteMapping("/customers/{id}")
	public ResponseEntity<Customers> deleteCustomerById(@PathVariable("id") Long id){
		try {
			pCustomerRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/customers/byfname")
	public List<Customers> getCustomerByFirstName(@RequestParam("fname") String fname){
		try {
			List<Customers> findCustomersByFirstName = pCustomerRepository.findCustomerByFirstName(fname);
			return findCustomersByFirstName;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
//	@GetMapping("/customers/bylname/{lname}")
//	public List<Customers> getCustomerByLastName(@PathVariable("lname") String lname){
//		try {
//			List<Customers> findCustomersByLastName = pCustomerRepository.findCustomerByLastName(lname);
//			return findCustomersByLastName;
//		} catch (Exception e) {
//			System.out.println(e);
//			return null;
//		}
//	}
	
	@GetMapping("/customers/bylname")
	public List<Customers> getCustomerByLastName(@RequestParam("lname") String lname){
		try {
			List<Customers> findCustomersByLastName = pCustomerRepository.findCustomerByLastName(lname);
			return findCustomersByLastName;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	@GetMapping("/customers/bycity")
	public List<Customers> getCustomerByCity(@RequestParam("city") String city){
		try {
			List<Customers> findCustomersByCity = pCustomerRepository.findCustomerByCityLike(city, PageRequest.of(0, 3));
			return findCustomersByCity;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	@GetMapping("/customers/bystate")
	public List<Customers> getCustomerByState(@RequestParam("state") String state){
		try {
			List<Customers> findCustomersByState = pCustomerRepository.findCustomerByStateLike(state, PageRequest.of(0, 3));
			return findCustomersByState;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	@GetMapping("/customer/bycountry")
	public List<Customers> getCustomerByCountry(@RequestParam("country") String country) {
		try {
			List<Customers> lCustomer = pCustomerRepository.findCustomerByCountryLike(country, PageRequest.of(0, 3));
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	

	@PutMapping("/customer/updatecountry")
	public ResponseEntity<Object> updateCustomerCountryNull(@RequestParam("country") String country) {
		try {
			int lCustomer = pCustomerRepository.updateCountry(country);
			return ResponseEntity.ok().body(lCustomer);
			//return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/customer/updatecountries")
	public ResponseEntity<Object> updateCustomerCountry(@RequestParam("country") String country, @RequestParam("countries") String countries) {
		try {
			int lCustomer = pCustomerRepository.updateCountries(country, countries);
			return ResponseEntity.ok().body(lCustomer);
			//return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/customer/customerbyphone/{phoneNumber}")
	public ResponseEntity<Customers> getCustomerByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
		try {
			Optional<Customers> lCustomer = pCustomerRepository.findByPhoneNumber(phoneNumber);
			if(lCustomer.isPresent()) {
				return new ResponseEntity<>(lCustomer.get(), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	//==================== theo rank customer ==================//
	
	@GetMapping("/customer/customerplatinum")
	public List<Object> getCustomerPlatinum() {
		try {
			List<Object> lCustomer = pCustomerRepository.listCustomerPlatinum();
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/customer/customergold")
	public List<Object> getCustomerGold() {
		try {
			List<Object> lCustomer = pCustomerRepository.listCustomerGold();
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/customer/customersilver")
	public List<Object> getCustomerSilver() {
		try {
			List<Object> lCustomer = pCustomerRepository.listCustomerSilver();
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/customer/customervip")
	public List<Object> getCustomerVip() {
		try {
			List<Object> lCustomer = pCustomerRepository.listCustomerVip();
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/customer/customertotalorder/{totalOrder}")
	public List<Object> getCustomerByTotalOrder(@PathVariable("totalOrder") int totalOrder) {
		try {
			List<Object> lCustomer = pCustomerRepository.listCustomerByTotalOrder(totalOrder);
			return lCustomer;
		} catch (Exception e) {
			return null;
		}
	}
	
	//===============theo rank excel ===================//
	
	@GetMapping("/export/customertotalorder/excel/{totalOrder}")
	public void exportToExcelByTotalOrder(HttpServletResponse response, @PathVariable("totalOrder") int totalOrder) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);
		List<ICustomerTotalOrder> customer = pCustomerRepository.listCustomerByTotalOrderExport(totalOrder);
		ExcelExporterCustomerTotalOrder excelExporter = new ExcelExporterCustomerTotalOrder(customer);
		excelExporter.export(response);
	}
	
	@GetMapping("/export/customerplatinum/excel")
	public void exportToExcelPlatinum(HttpServletResponse response) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);
		List<ICustomerLevel> customer = pCustomerRepository.listCustomerPlatinumExport();
		ExcelExporterCustomerLevel excelExporter = new ExcelExporterCustomerLevel(customer);
		excelExporter.export(response);
	}
	
	@GetMapping("/export/customergold/excel")
	public void exportToExcelGold(HttpServletResponse response) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);
		List<ICustomerLevel> customer = pCustomerRepository.listCustomerGoldExport();
		ExcelExporterCustomerLevel excelExporter = new ExcelExporterCustomerLevel(customer);
		excelExporter.export(response);
	}
	
	@GetMapping("/export/customersilver/excel")
	public void exportToExcelSilver(HttpServletResponse response) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);
		List<ICustomerLevel> customer = pCustomerRepository.listCustomerSilverExport();
		ExcelExporterCustomerLevel excelExporter = new ExcelExporterCustomerLevel(customer);
		excelExporter.export(response);
	}
	
	
	@GetMapping("/export/customervip/excel")
	public void exportToExcelVip(HttpServletResponse response) throws IOException {
		response.setContentType("application/octet-stream");
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
		String currentDateTime = dateFormatter.format(new Date());
		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
		response.setHeader(headerKey, headerValue);
		List<ICustomerLevel> customer = pCustomerRepository.listCustomerVipExport();
		ExcelExporterCustomerLevel excelExporter = new ExcelExporterCustomerLevel(customer);
		excelExporter.export(response);
	}
	
	
	
	
	
	
	
	

}
