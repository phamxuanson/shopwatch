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

import com.devcamp.watch.model.ProductLine;
import com.devcamp.watch.repository.ProductLineRepository;

@CrossOrigin
@RestController
@RequestMapping("/")
public class ProductLineController {

	@Autowired
	ProductLineRepository pProductLineRepository;
	
	@GetMapping("/productlines")
	public List<ProductLine> getAll(){
		try {
			return pProductLineRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/productlines/{id}")
	public ResponseEntity<Object> getProductlinesById(@PathVariable("id") Long id){
		try {
			Optional<ProductLine> productLineData = pProductLineRepository.findById(id);
			if(productLineData.isPresent()) {
				return new ResponseEntity<>(productLineData.get(), HttpStatus.FOUND);				
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/productlines")
	public ResponseEntity<Object> createProductLine(@Valid @RequestBody ProductLine productLine){
		try {
			ProductLine _productLine = pProductLineRepository.save(productLine);
			return new ResponseEntity<>(_productLine, HttpStatus.CREATED);
		} catch (Exception e) {
			System.out.println("+++++++++++++++++++++::::: "+e.getCause().getCause().getMessage());
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified ProductLine: "+e.getCause().getCause().getMessage());
		}
	}
	
	@PutMapping("/productlines/{id}")
	public ResponseEntity<Object> updateProductlines(@PathVariable("id") Long id, @RequestBody ProductLine productLine){
		try {
			Optional<ProductLine> productLineData = pProductLineRepository.findById(id);
			if (productLineData.isPresent()) {
				ProductLine newProductLine = productLineData.get();
				newProductLine.setProductLine(productLine.getProductLine());		
				newProductLine.setDescription(productLine.getDescription());	

				ProductLine save = pProductLineRepository.save(newProductLine);
				return new ResponseEntity<>(save, HttpStatus.OK);			
			}
			else {
				return ResponseEntity.badRequest().body("Failed to get specified Customer: " + id + "  for update.");
			}
		} catch (Exception e) {
			return ResponseEntity.unprocessableEntity()
					.body("Failed to Update specified Customer:" + e.getCause().getCause().getMessage());
		}
	}
	
	@DeleteMapping("/productlines/{id}")
	public ResponseEntity<ProductLine> deleteProductLineById(@PathVariable("id") Long id){
		try {
			pProductLineRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/productline/discriptionupdate/{descriptionNhap}")
	public ResponseEntity<List<ProductLine>> updateProductLineWithDescription(@PathVariable("descriptionNhap") String descriptionNhap){
		try {
			int vProductLine = pProductLineRepository.updateProductLineWithDescription( descriptionNhap);
			if (vProductLine > 0) {
				return new ResponseEntity<>(HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
