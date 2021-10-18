package com.devcamp.watch.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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

import com.devcamp.watch.model.ProductLine;
import com.devcamp.watch.model.Products;
import com.devcamp.watch.repository.ProductLineRepository;
import com.devcamp.watch.repository.ProductRepository;

@CrossOrigin
@RestController
@RequestMapping("/")
public class ProductController {
	
	@Autowired
	ProductRepository pProductRepository;
	
	@Autowired
	ProductLineRepository pProductLineRepository;
	
	@GetMapping("/products")
	public List<Products> getAll(){
		try {
			return pProductRepository.findAll();
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}
	
	@GetMapping("/product/details/{id}")
	public ResponseEntity<Object> getProductsById(@PathVariable("id") Long id){
		try {
			Optional<Products> productsData = pProductRepository.findById(id);
			if(productsData.isPresent()) {
				return new ResponseEntity<>(productsData.get(), HttpStatus.OK);				
			}
			else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.err.println(e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/productlines/{id}/product")
	public List<Products> getProductByProductLineId(@PathVariable("id") Long id){
		Optional<ProductLine> productLineData = pProductLineRepository.findById(id);
		if(productLineData.isPresent()) {
			return productLineData.get().getProducts();
		}else {
			return null;
		}
	}
	
	@PostMapping("/productlines/{id}/product")
	public ResponseEntity<Object> createProductByProductLineId(@PathVariable("id") Long id, @RequestBody Products products){
		try {
			Optional<ProductLine> productLineData = pProductLineRepository.findById(id);
			if(productLineData.isPresent()) {
				Products newProduct = new Products();
				newProduct.setProductCode(products.getProductCode());
				newProduct.setProductName(products.getProductName());
				newProduct.setProductImage(products.getProductImage());
				newProduct.setProductDescription(products.getProductDescription());
				newProduct.setProductVendor(products.getProductVendor());
				newProduct.setQuantityInStock(products.getQuantityInStock());
				newProduct.setBuyPrice(products.getBuyPrice());
				
				ProductLine _productLine = productLineData.get();
				newProduct.setProduct_line(_productLine);
				
				Products save = pProductRepository.save(newProduct);
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
	
	@PutMapping("/products/{id}")
	public ResponseEntity<Object> updateProductById(@PathVariable("id") Long id, @RequestBody Products products){
		try {
			Optional<Products> productsData = pProductRepository.findById(id);
			if(productsData.isPresent()) {
				Products newProduct = productsData.get();
				newProduct.setProductCode(products.getProductCode());
				newProduct.setProductName(products.getProductName());
				newProduct.setProductDescription(products.getProductDescription());
				newProduct.setProductVendor(products.getProductVendor());
				newProduct.setQuantityInStock(products.getQuantityInStock());
				newProduct.setBuyPrice(products.getBuyPrice());
				
				Products save = pProductRepository.save(newProduct);
				return new ResponseEntity<>(save, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@DeleteMapping("/products/{id}")
	public ResponseEntity<Object> deleteProductById(@PathVariable("id") Long id) {
		try {
			pProductRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/products/code/{code}")
	public ResponseEntity<List<Products>> getProductByProductCode(@PathVariable("code") String code){
		try {
			var vProduct = pProductRepository.findProductByProductCode(code);
			if (vProduct != null) {
				return new ResponseEntity<>(vProduct,HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/products/quantityinstock/{quantity}")
	public ResponseEntity<List<Products>> updateProductWithQuantity(@PathVariable("quantity") String quantity){
		try {
			int vProduct = pProductRepository.updateProductWithQuantity( quantity);
			if (vProduct > 0) {
				return new ResponseEntity<>(HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			System.out.println();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/product/limit8")
	public List<Products> getListProductLimit8() {
		try {
			List<Products> lProduct = pProductRepository.listProductlimit8();
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	// ========================================== product by pageable12 ====================================================
	@GetMapping("/product/length")
	public int getLengthProduct() {
		return pProductRepository.findAll().size();
	}
	
	@GetMapping("/product/pageable/{page}")
	public List<Products> listProductsPageable(@PathVariable("page") int page){
		try {
			int number = 12;
			List<Products> lProduct = pProductRepository.listProductPageable(PageRequest.of(page, number));
			
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
//	@GetMapping("/products_filter_vendor")
//	public ResponseEntity<Object> getProductListByFilter(@RequestParam String[] product_vendor, @RequestParam Integer page, @RequestParam Integer limit) {
//		try {
//			List<Products> products = pProductRepository.getListProductByFilter(product_vendor, PageRequest.of(page, limit));
//			
//			return new ResponseEntity<>(products, HttpStatus.OK);
//		} catch (Exception e) {
//			System.out.println(e);
//			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
	
	
	// ========================================== product by all ====================================================
	
	
	@GetMapping("/products_filter_vendor_price")
	public ResponseEntity<Object> getProductListByFilterPrice(@RequestParam List<String> product_vendor,@RequestParam String price_min,@RequestParam String price_max,  @RequestParam Integer page, @RequestParam Integer limit) {
		String min;
		String max;
		try {
			if(price_min == null || price_min == "")
				min=null;
			else min = price_min;
			if(price_max ==null || price_max == "")
				max=null;
			else max = price_max;
			
			List<Products> products = pProductRepository.getListProductByFilter(product_vendor, min, max, PageRequest.of(page, limit));
			
			return new ResponseEntity<>(products, HttpStatus.OK);
		} catch (Exception e) {
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
// ========================================== product by productLineId ====================================================

	@GetMapping("/product/byproductlineid/{productLineId}/{page}")
	public List<Products> getListProductByProductLineId(@PathVariable("productLineId") int productLineId,@PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByProductLinePageable(productLineId,PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthproductlineid/{productLineId}")
	public int getLengthListProductByProductLineId(@PathVariable("productLineId") int productLineId) {
		try {
			int lProduct = pProductRepository.lengthProductByProductLinePageable(productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
		
	// ========================================== product by vendor and productLineId ===============================================
	
	@GetMapping("/product/vendorline/{productLineId}/{productVendor}/{page}")
	public List<Products> getListProductVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByVendorAndProductLine(productVendor, productLineId,
					PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthvendorline/{productLineId}/{productVendor}")
	public int getLengthListProductVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor) {
		try {
			int lProduct = pProductRepository.lengthProductByVendorAndProductLine(productVendor, productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ================================= product by price 0 to price and productLineId =====================================//
	
	@GetMapping("/product/pricedownline/{productLineId}/{buyPrice}/{page}")
	public List<Products> getListProductPriceDownLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("buyPrice") int buyPrice, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByPriceDownAndProductLine(buyPrice,productLineId,
					PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthpricedownline/{productLineId}/{buyPrice}")
	public int getLengthListProductPriceDownLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByPriceDownAndProductLine(buyPrice,productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ======================== product by price to max price and productLineId =================================
		
	@GetMapping("/product/priceupline/{productLineId}/{buyPrice}/{page}")
	public List<Products> getListProductPriceUpLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("buyPrice") int buyPrice, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByPriceUpAndProductLine(buyPrice, productLineId,
					PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthpriceupline/{productLineId}/{buyPrice}")
	public int getLengthListProductPriceUpLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByPriceUpAndProductLine(buyPrice, productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ========================================== product by price to max price, vendor and productLineId ===============================================

	@GetMapping("/product/priceupvendorline/{productLineId}/{productVendor}/{buyPrice}/{page}")
	public List<Products> getListProductPriceUpVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor, @PathVariable("buyPrice") int buyPrice,
			@PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByPriceUpVendorProductLine(productVendor, buyPrice,
					productLineId, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
			
	@GetMapping("/product/lengthpriceupvendorline/{productLineId}/{productVendor}/{buyPrice}/{page}")
	public int getLengthListProductPriceUpVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor, @PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByPriceUpVendorProductLine(productVendor, buyPrice, productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}	
	
	// ========================================== product by price from 0 to price, vendor and productLineId ===============================================

	@GetMapping("/product/pricedownvendorline/{productLineId}/{productVendor}/{buyPrice}/{page}")
	public List<Products> getListProductPriceDownVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor, @PathVariable("buyPrice") int buyPrice,
			@PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByPriceDownVendorProductLine(productVendor, buyPrice,
					productLineId, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
			
	@GetMapping("/product/lengthpricedownvendorline/{productLineId}/{productVendor}/{buyPrice}/{page}")
	public int getLengthListProductPriceDownVendorLine(@PathVariable("productLineId") int productLineId,
			@PathVariable("productVendor") String productVendor, @PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByPriceDownVendorProductLine(productVendor, buyPrice,productLineId).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}	
	
	// ========================================== price from 0 to price================================================

	@GetMapping("/product/pricedown/{buyPrice}/{page}")
	public List<Products> getListProductByBuyPriceDown(@PathVariable("buyPrice") int buyPrice,
			@PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByBuyPriceDown(buyPrice, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthpricedown/{buyPrice}")
	public int getLengthProductByBuyPriceDown(@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByBuyPriceDown(buyPrice).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ========================================== price from price to max================================================
	
	@GetMapping("/product/priceup/{buyPrice}/{page}")
	public List<Products> getListProductByPriceUp(@PathVariable("buyPrice") int buyPrice, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByBuyPriceUp(buyPrice, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthpriceup/{buyPrice}")
	public int getLengthProductByBuyPriceUp(@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByBuyPriceUp(buyPrice).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ========================================== vendor and price from price to max ================================================

	@GetMapping("/product/vendorpriceup/{productVendor}/{buyPrice}/{page}")
	public List<Products> getListProductByVendorPriceUp(@PathVariable("productVendor") String productVendor,
			@PathVariable("buyPrice") int buyPrice, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByVendorPriceUp(productVendor, buyPrice, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}
	
	@GetMapping("/product/lengthvendorpriceup/{productVendor}/{buyPrice}")
	public int getLengthListProductByVendorPriceUp(@PathVariable("productVendor") String productVendor,
			@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByVendorPriceUp(productVendor, buyPrice).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
	// ========================================== vendor and price from 0 to price ================================================
	
	@GetMapping("/product/vendorpricedown/{productVendor}/{buyPrice}/{page}")
	public List<Products> getListProductByVendorPriceDown(@PathVariable("productVendor") String productVendor,
			@PathVariable("buyPrice") int buyPrice, @PathVariable("page") int page) {
		try {
			List<Products> lProduct = pProductRepository.listProductByVendorPriceDown(productVendor, buyPrice, PageRequest.of(page, 12));
			return lProduct;
		} catch (Exception e) {
			return null;
		}
	}

	@GetMapping("/product/lengthvendorpricedown/{productVendor}/{buyPrice}")
	public int getLengthListProductByVendorPriceDown(@PathVariable("productVendor") String productVendor,
			@PathVariable("buyPrice") int buyPrice) {
		try {
			int lProduct = pProductRepository.lengthProductByVendorPriceDown(productVendor, buyPrice).size();
			return lProduct;
		} catch (Exception e) {
			return 0;
		}
	}
	
		
}
