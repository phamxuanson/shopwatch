package com.devcamp.watch.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

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

import com.devcamp.watch.model.Customers;
import com.devcamp.watch.model.Orders;
import com.devcamp.watch.repository.CustomerRepository;
import com.devcamp.watch.repository.IMyOrder;
import com.devcamp.watch.repository.IOrder;
import com.devcamp.watch.repository.IOrderTotalMoneyWeek;
import com.devcamp.watch.repository.OrderReposity;
import com.devcamp.watch.service.ExcelExporterOrderTotalMoneyDay;
import com.devcamp.watch.service.ExcelExporterOrderTotalMoneyWeek;

@CrossOrigin
@RestController
@RequestMapping("/")
public class OrderController {
	
	@Autowired
	OrderReposity pOrderRepository;
	
	@Autowired
	CustomerRepository pCustomerRepository;
	
	@GetMapping("/orders")
	public List<Orders> getAll(){
		try {
			return pOrderRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/orders/{id}")
	public ResponseEntity<Object> getOrdersById(@PathVariable("id") Long id){
		try {
			Optional<Orders> ordersData = pOrderRepository.findById(id);
			if(ordersData.isPresent()) {
				return new ResponseEntity<>(ordersData.get(), HttpStatus.FOUND);				
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/customers/{id}/order")
	public List<Orders> getOrderByCustomerId(@PathVariable("id") Long id){
		Optional<Customers> customerData = pCustomerRepository.findById(id);
		if(customerData.isPresent()) {
			return customerData.get().getOrders();
		}else {
			return null;
		}
	}
	
	@PostMapping("/customers/{id}/order")
	public ResponseEntity<Object> createOrderByCustomerId(@PathVariable("id") Long id, @RequestBody Orders orders){
		try {
			Optional<Customers> customerData = pCustomerRepository.findById(id);
			if(customerData.isPresent()) {
				Orders newOrder = new Orders();
				newOrder.setOrderDate(new Date());
				newOrder.setRequiredDate(new Date());
				newOrder.setShippedDate(new Date());			
				newOrder.setComments(orders.getComments());
				newOrder.setStatus(orders.getStatus());
//				newOrder.setOrderDetails(orders.getOrderDetails());
				
				Customers _customer = customerData.get();
				newOrder.setCustomer(_customer);
				
				Orders save = pOrderRepository.save(newOrder);
				return new ResponseEntity<>(save, HttpStatus.CREATED);
			}
			else {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified Order: " + e.getCause() + "for create");

		}
	}
	
	@PostMapping("/order/create")
	public ResponseEntity<Object> createOrderByd(@RequestBody Orders orders){
		try {
				Orders newOrder = new Orders();
				newOrder.setOrderDate(new Date());
				newOrder.setRequiredDate(new Date());
				newOrder.setShippedDate(new Date());			
				newOrder.setComments(orders.getComments());
				newOrder.setStatus(orders.getStatus());
//				newOrder.setOrderDetails(orders.getOrderDetails());
				
				Orders save = pOrderRepository.save(newOrder);
				return new ResponseEntity<>(save, HttpStatus.CREATED);
			
		} catch (Exception e) {
			System.err.println(e);
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified Order: " + e.getCause() + "for create");

		}
	}
	
	@PutMapping("/orders/{id}")
	public ResponseEntity<Object> updateOrderById(@PathVariable("id") Long id, @RequestBody Orders orders){
		try {
			Optional<Orders> ordertData = pOrderRepository.findById(id);
			if(ordertData.isPresent()) {
				Orders newOrder = ordertData.get();
				newOrder.setOrderDate(orders.getOrderDate());
				newOrder.setRequiredDate(orders.getRequiredDate());
				newOrder.setShippedDate(orders.getShippedDate());
				newOrder.setStatus(orders.getStatus());
				newOrder.setComments(orders.getComments());
				
				Orders save = pOrderRepository.save(newOrder);
				return new ResponseEntity<>(save, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/order/update/{orderId}/{customerId}")
	public ResponseEntity<Object> updateOrder(@PathVariable("orderId") Long orderId,
			@PathVariable("customerId") Long customerId, @RequestBody Orders order) {
		Optional<Orders> orderData = pOrderRepository.findById(orderId);
		Optional<Customers> customerData = pCustomerRepository.findById(customerId);

		if (orderData.isPresent()) {
			Orders newOrder = orderData.get();
//			newOrder.setOrderDate(order.getOrderDate());
//			newOrder.setRequiredDate(order.getRequiredDate());
//			newOrder.setShippedDate(order.getShippedDate());
			newOrder.setStatus(order.getStatus());
			newOrder.setComments(order.getComments());

			Customers _customer = customerData.get();
			newOrder.setCustomer(_customer);
			Orders saveOrder = pOrderRepository.save(newOrder);
			return new ResponseEntity<>(saveOrder, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/orders/{id}")
	public ResponseEntity<Object> deleteOrderById(@PathVariable("id") Long id) {
		try {
			pOrderRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/orders/bycustomerId")
	public List<Orders> getOfficesByIdCustomer(@RequestParam("customerId") Long customerId){
		try {
			List<Orders> lOffices = pOrderRepository.findOrderByCustomerId(customerId);
			return lOffices;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	@GetMapping("/orders/byorderDate")
	public List<Orders> getOrderByOrderDate(@RequestParam("orderDate") String orderDate){
		try {
			List<Orders> lOffices = pOrderRepository.findOrderByOrderDate(orderDate);
			return lOffices;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	@CrossOrigin
	@GetMapping("/orders/findname")
	public ResponseEntity<List<Orders>> getOrdersByCustomerName(@RequestParam("name") String name){
		try {
			List<Orders> lisOrders = pOrderRepository.getOrdersByCustomerName(name);
			if (lisOrders != null) {
				return new ResponseEntity<>(lisOrders , HttpStatus.OK);
			}else {
				return new ResponseEntity<>(null , HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/orders/byorderDateAsc")
	public List<Orders> getOrderByOrderDateAsc(){
		try {
			List<Orders> lOffices = pOrderRepository.findOrderByOrderDateAsc();
			return lOffices;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}	
	}
	
	// --------------------theo ngay---------------------//
	
	@GetMapping("/order/datereport/{dateBegin}/{dateEnd}")
	public List<Object> getOrderByDate(@PathVariable("dateBegin") int dateBegin, @PathVariable("dateEnd") int dateEnd) {
		try {
			List<Object> listOrder = pOrderRepository.listOrderbydate(dateBegin, dateEnd);
//			ExcelExporterOrder excelExporter = new ExcelExporterOrder(listOrder);
			return listOrder;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/order/datereportexcell/{dateBegin}/{dateEnd}")
	public void getOrderByDateExportExcel(HttpServletResponse response, @PathVariable("dateBegin") int dateBegin,
			@PathVariable("dateEnd") int dateEnd) {
		try {
			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());
			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			List<IOrder> listOrder = pOrderRepository.listOrderByDateExport(dateBegin, dateEnd);
			ExcelExporterOrderTotalMoneyDay excelExporter = new ExcelExporterOrderTotalMoneyDay(listOrder);
			excelExporter.export(response);
		} catch (Exception e) {
			System.out.print(e);
		}
	}
	
	// --------------------theo tuan---------------------//
	
	@GetMapping("/order/weekreport/{year}")
	public List<Object> getOrderByYear(@PathVariable("year") int year) {
		try {
			List<Object> listOrder = pOrderRepository.listOrderbyweek(year);
			return listOrder;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/order/yearreportexcell/{year}")
	public void getOrderByYearExportExcel(HttpServletResponse response, @PathVariable("year") int year) {
		try {
			response.setContentType("application/octet-stream");
			DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
			String currentDateTime = dateFormatter.format(new Date());
			String headerKey = "Content-Disposition";
			String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
			response.setHeader(headerKey, headerValue);
			List<IOrderTotalMoneyWeek> listOrder = pOrderRepository.listOrderbyweekExport(year);
			ExcelExporterOrderTotalMoneyWeek excelExporter = new ExcelExporterOrderTotalMoneyWeek(listOrder);
			excelExporter.export(response);
		} catch (Exception e) {
			System.out.print(e);
		}
	}
	
	@GetMapping("/order/listorderbycustomerid/{customerId}")
	public List<IMyOrder> getListOrderByCustomerId(@PathVariable("customerId") long customerId) {
		try {
			List<IMyOrder> listOrder = pOrderRepository.listMyOrderByCustomerId(customerId);
			return listOrder;
		} catch (Exception e) {
			return null;
		}
	}
	
	
	
	
	
	
	
	
}
