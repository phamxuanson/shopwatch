package com.devcamp.watch.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;

@Entity
@Table(name="order_details")
public class OrderDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name="price_each")
	private BigDecimal priceEach;

	@Column(name="quantity_order")
	private int quantityOrder;
	
	@ManyToOne
//	@JsonIgnore
	private Orders order;
	
	@ManyToOne
//	@JsonIgnore
	private Products product;
	
	@OneToOne(mappedBy = "orderdetails")
//	@JsonIgnore
	private Rate rate;
	

	public OrderDetails() {
		
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public BigDecimal getPriceEach() {
		return priceEach;
	}

	public void setPriceEach(BigDecimal priceEach) {
		this.priceEach = priceEach;
	}

	public int getQuantityOrder() {
		return quantityOrder;
	}

	public void setQuantityOrder(int quantityOrder) {
		this.quantityOrder = quantityOrder;
	}
//	@JsonIgnore
	public Orders getOrder() {
		return order;
	}

	public void setOrder(Orders order) {
		this.order = order;
	}
//	@JsonIgnore
	public Products getProduct() {
		return product;
	}

	public void setProduct(Products product) {
		this.product = product;
	}
}

