package com.devcamp.watch.controller;

import java.util.Date;
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

import com.devcamp.watch.model.Customers;
import com.devcamp.watch.model.OrderDetails;
import com.devcamp.watch.model.Products;
import com.devcamp.watch.model.Rate;
import com.devcamp.watch.repository.CustomerRepository;
import com.devcamp.watch.repository.OrderDetailsRepository;
import com.devcamp.watch.repository.ProductRepository;
import com.devcamp.watch.repository.RateRepository;


@CrossOrigin
@RestController
@RequestMapping("/")
public class RateController {
	@Autowired
	private RateRepository pRateRepository;
	
	@Autowired
	private OrderDetailsRepository orderDetailsRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	private ProductRepository productRepository;

	@GetMapping("/rate")
	public List<Rate> getAllUser(){
		try {
			return pRateRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/rate/{id}")
	public ResponseEntity<Object> getUserById(@PathVariable("id") Long id){
		try {
			Optional<Rate> rateData = pRateRepository.findById(id);
			if(rateData.isPresent()) {
				return new ResponseEntity<>(rateData.get(), HttpStatus.FOUND);
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/rate/create/{orderDetailId}/{productId}/{customerId}")
	public ResponseEntity<Object> createRate(@Valid @RequestBody Rate rate, @PathVariable("orderDetailId") Long orderDetailId, 
			@PathVariable("productId") Long productId, @PathVariable("customerId") Long customerId) {
		
		Optional<OrderDetails> orderDetailData = orderDetailsRepository.findById(orderDetailId);
		Optional<Products> productData = productRepository.findById(productId);
		Optional<Customers> customerData = customerRepository.findById(customerId);
		
		if(orderDetailData.isPresent() & productData.isPresent() & customerData.isPresent()) {
			
			try {
				Rate newRate = new Rate();
				newRate.setRateScore(rate.getRateScore());
				newRate.setComments(rate.getComments());
				newRate.setCreateDate(new Date());
				newRate.setUpdateDate(new Date());
				
				OrderDetails _orderDetail = orderDetailData.get();
				Products _product = productData.get();
				Customers _customer = customerData.get();
				
				newRate.setOrderdetails(_orderDetail);
				newRate.setProduct(_product);
				newRate.setCustomer(_customer);
				
				Rate _rate = pRateRepository.save(newRate);
				return new ResponseEntity<>(_rate, HttpStatus.CREATED);

			} catch (Exception e) {
				System.out.println("+++++++++++++++++++++::::: " + e.getCause().getCause().getMessage());
				return ResponseEntity.unprocessableEntity()
						.body("Failed to Create specified Rate: " + e.getCause().getCause().getMessage());
			}
		}
		else {
			return ResponseEntity.badRequest().body("Failed to create Rate");
		}
		
	}
	
	@PutMapping("/rate/update/{id}")
	public ResponseEntity<Object> updateRate(@PathVariable("id") long id, @RequestBody Rate rate) {
		Optional<Rate> rateData = pRateRepository.findById(id);
		if (rateData.isPresent()) {
			Rate newRate = rateData.get();
			
			newRate.setRateScore(rate.getRateScore());
			newRate.setComments(rate.getComments());
			newRate.setUpdateDate(new Date());
			
			
			Rate saveRate = pRateRepository.save(newRate);
			try {
				return new ResponseEntity<>(saveRate, HttpStatus.OK);
			} catch (Exception e) {
				return ResponseEntity.unprocessableEntity()
						.body("Failed to Update specified Rate:" + e.getCause().getCause().getMessage());
			}
		} else {
			return ResponseEntity.badRequest().body("Failed to get specified Rate: " + id + "  for update.");
		}
	}
	
	@DeleteMapping("/rate/delete/{id}")
	public ResponseEntity<Object> deleteRateById(@PathVariable("id") Long id) {
		try {
			pRateRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/rate/listratebycustomerid/{customerId}")
	public List<Rate> getListRateByCustomerId(@PathVariable("customerId") int customerId) {
		try {
			List<Rate> lRate = pRateRepository.listRateByCustomerId(customerId);
			return lRate;
		} catch (Exception e) {
			return null;
		}
	}
	

	@GetMapping("/rate/listratebyproductid/{productId}")
	public List<Rate> getListRateByProductId(@PathVariable("productId") int productId) {
		try {
			List<Rate> lRate = pRateRepository.listRateByProductId(productId);
			return lRate;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/rate/ratebyorderdetailId/{orderdetailId}")
	public Rate getRateByOrderDetailId(@PathVariable("orderdetailId") int orderdetailId) {
		try {
			Rate lRate = pRateRepository.rateByOrderDetailId(orderdetailId);
			return lRate;
		} catch (Exception e) {
			return null;
		}
	}
	
	
	
}
