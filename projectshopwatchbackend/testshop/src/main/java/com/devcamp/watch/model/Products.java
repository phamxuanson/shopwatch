package com.devcamp.watch.model;

import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name="products")
public class Products {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@NotNull(message = "Phải có productCode")
	@Column(name="product_code", unique = true)
	private String productCode;
	
	@NotNull(message = "Phải có productName")
	@Column(name="product_name")
	private String productName;
	
	@Column(name="product_description")
	private String productDescription;
	
	public String getProductImage() {
		return productImage;
	}

	public void setProductImage(String productImage) {
		this.productImage = productImage;
	}

	// product_line_id
	@ManyToOne
//	@JsonIgnore
	private ProductLine product_line;
	
	@OneToMany(mappedBy="product")
	private List<Rate> rates;

	@NotNull(message = "Phải có productImage")
	@Column(name="product_image")
	private String productImage;
	
	@NotNull(message = "Phải có productVendor")
	@Column(name="product_vendor")
	private String productVendor;
	
	@NotNull(message = "Phải có quantityInStock")
	@Column(name="quantity_in_stock")
	private String quantityInStock;
	
	@NotNull(message = "Phải có buyPrice")
	@Column(name="buy_price")
	private String buyPrice;
	
	@JsonIgnore
	@OneToMany(mappedBy="product", cascade = CascadeType.ALL)
	private List<OrderDetails> orderDetails;
	
	public Products() {
		
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductDescription() {
		return productDescription;
	}

	public void setProductDescription(String productDescription) {
		this.productDescription = productDescription;
	}
	@JsonIgnore
	public ProductLine getProduct_line() {
		return product_line;
	}

	public void setProduct_line(ProductLine product_line) {
		this.product_line = product_line;
	}

	public String getProductVendor() {
		return productVendor;
	}

	public void setProductVendor(String productVendor) {
		this.productVendor = productVendor;
	}

	public String getQuantityInStock() {
		return quantityInStock;
	}

	public void setQuantityInStock(String quantityInStock) {
		this.quantityInStock = quantityInStock;
	}

	public String getBuyPrice() {
		return buyPrice;
	}

	public void setBuyPrice(String buyPrice) {
		this.buyPrice = buyPrice;
	}

	public List<OrderDetails> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(List<OrderDetails> orderDetails) {
		this.orderDetails = orderDetails;
	}
}
