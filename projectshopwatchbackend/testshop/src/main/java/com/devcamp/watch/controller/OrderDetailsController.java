package com.devcamp.watch.controller;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.watch.model.OrderDetails;
import com.devcamp.watch.model.Orders;
import com.devcamp.watch.model.Products;
import com.devcamp.watch.repository.OrderDetailsRepository;
import com.devcamp.watch.repository.OrderReposity;
import com.devcamp.watch.repository.ProductRepository;

@CrossOrigin
@RestController
@RequestMapping("/")
public class OrderDetailsController {

	@Autowired
	OrderDetailsRepository pOrderDetailsRepository;
	
	@Autowired
	OrderReposity pOrderReposity;
	
	@Autowired
	ProductRepository pProductReposity;
	
	@GetMapping("/orderdetails")
	public List<OrderDetails> getAll(){
		try {
			return pOrderDetailsRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/ordersdetails/{id}")
	public ResponseEntity<Object> getOrderDetailsById(@PathVariable("id") Long id){
		try {
			Optional<OrderDetails> orderDetailsData = pOrderDetailsRepository.findById(id);
			if(orderDetailsData.isPresent()) {
				return new ResponseEntity<>(orderDetailsData.get(), HttpStatus.FOUND);				
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/orders/{id}/ordersdetails")
	public List<OrderDetails> getOrderDetailByOrderId(@PathVariable("id") Long id){
		Optional<Orders> orderData = pOrderReposity.findById(id);
		if(orderData.isPresent()) {
			return orderData.get().getOrderDetails();
		}else {
			return null;
		}
	}

	@GetMapping("/products/{id}/ordersdetails")
	public List<OrderDetails> getOrderDetailByProductId(@PathVariable("id") Long id){
		Optional<Products> productData = pProductReposity.findById(id);
		if(productData.isPresent()) {
			return productData.get().getOrderDetails();
		}else {
			return null;
		}
	}
	
	@PostMapping("/orders/{orderid}/products/{productid}/orderdetail")
	public ResponseEntity<Object> createOrderDetailByOrderId(@PathVariable("orderid") Long orderid, @PathVariable("productid") Long productid, @RequestBody OrderDetails orderDetails){
		try {
			Optional<Orders> orderData = pOrderReposity.findById(orderid);
			Optional<Products> productData = pProductReposity.findById(productid);
			if(orderData.isPresent()) {
				
				OrderDetails newOrderDetail = new OrderDetails();
				newOrderDetail.setQuantityOrder(orderDetails.getQuantityOrder());
				newOrderDetail.setPriceEach(orderDetails.getPriceEach());
				
				Orders _order = orderData.get();
				Products _product = productData.get();
				newOrderDetail.setOrder(_order);
				newOrderDetail.setProduct(_product);
				
				OrderDetails save = pOrderDetailsRepository.save(newOrderDetail);
				return new ResponseEntity<>(save, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified OrderDetails: " + e.getCause() + "for create");

		}
	}
	
	@PostMapping("/orders/{id}/orderdetail")
	public ResponseEntity<Object> createOrderDetailByOrderId(@PathVariable("id") Long id, @RequestBody OrderDetails orderDetails){
		try {
			Optional<Orders> orderData = pOrderReposity.findById(id);
			if(orderData.isPresent()) {
				OrderDetails newOrderDetails = new OrderDetails();
				newOrderDetails.setPriceEach(orderDetails.getPriceEach());
				newOrderDetails.setQuantityOrder(orderDetails.getQuantityOrder());
				
				Orders _orders = orderData.get();
				newOrderDetails.setOrder(_orders);
				
				OrderDetails save = pOrderDetailsRepository.save(newOrderDetails);
				return new ResponseEntity<>(save, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified Payment: " + e.getCause() + "for create");

		}
	}
	
	@PostMapping("/products/{id}/orderdetail")
	public ResponseEntity<Object> createOrderDetailByProductId(@PathVariable("id") Long id, @RequestBody OrderDetails orderDetails){
		try {
			Optional<Products> productData = pProductReposity.findById(id);
			if(productData.isPresent()) {
				OrderDetails newOrderDetails = new OrderDetails();
				newOrderDetails.setPriceEach(orderDetails.getPriceEach());
				newOrderDetails.setQuantityOrder(orderDetails.getQuantityOrder());
				
				Products _products = productData.get();
				newOrderDetails.setProduct(_products);
				
				OrderDetails save = pOrderDetailsRepository.save(newOrderDetails);
				return new ResponseEntity<>(save, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified Payment: " + e.getCause() + "for create");

		}
	}
	
	@PutMapping("/orderdetails/{id}")
	public ResponseEntity<Object> updateOrderDetailById(@PathVariable("id") Long id, @RequestBody OrderDetails orderDetails){
		try {
			Optional<OrderDetails> orderDetailtData = pOrderDetailsRepository.findById(id);
			if(orderDetailtData.isPresent()) {
				OrderDetails newOrderDetail = orderDetailtData.get();
				newOrderDetail.setQuantityOrder(orderDetails.getQuantityOrder());
				newOrderDetail.setPriceEach(orderDetails.getPriceEach());
				
				OrderDetails save = pOrderDetailsRepository.save(newOrderDetail);
				return new ResponseEntity<>(save, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/orderdetail/update/{orderDetailId}/{orderId}/{productId}")
	public ResponseEntity<Object> updateOrderDetail(@PathVariable("orderDetailId") Long orderDetailId,
			@PathVariable("orderId") Long orderId, @PathVariable("productId") Long productId, @RequestBody OrderDetails orderDetail) {
		Optional<OrderDetails> orderDetailData = pOrderDetailsRepository.findById(orderDetailId);
		Optional<Orders> orderData = pOrderReposity.findById(orderId);
		Optional<Products> productData = pProductReposity.findById(productId);
		if (orderDetailData.isPresent() & orderData.isPresent() & productData.isPresent()) {
			OrderDetails newOrderDetail = orderDetailData.get();
			
			
			newOrderDetail.setQuantityOrder(orderDetail.getQuantityOrder());
			
			Orders _order = orderData.get();
			Products _product = productData.get();
			newOrderDetail.setOrder(_order);
			newOrderDetail.setProduct(_product);
			
			OrderDetails saveOrder = pOrderDetailsRepository.save(newOrderDetail);

			return new ResponseEntity<>(saveOrder, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/orderdetails/{id}")
	public ResponseEntity<Object> deleteOrderDetailById(@PathVariable("id") Long id) {
		try {
			pOrderDetailsRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/orderdetails/byorderId")
	public List<OrderDetails> findOrderDetailByOrderId(@RequestParam("orderId") Long id){
		try {
			List<OrderDetails> lOrderDetails = pOrderDetailsRepository.findOrderDetailByOrderId(id);
			return lOrderDetails;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/orderdetails/byproductId")
	public List<OrderDetails> findOrderDetailByProductId(@RequestParam("orderId") Long id){
		try {
			List<OrderDetails> lOrderDetails = pOrderDetailsRepository.findOrderDetailProductId(id);
			return lOrderDetails;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
}
