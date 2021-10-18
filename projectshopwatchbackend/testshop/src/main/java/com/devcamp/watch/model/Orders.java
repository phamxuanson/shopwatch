package com.devcamp.watch.model;

import java.util.Date;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "orders")
public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	@Column(name="comments")
	private String comments;

	@NotNull(message = "Phải có orderDate")
	@Temporal(TemporalType.DATE)
	@Column(name="order_date")
	private Date orderDate;

	@NotNull(message = "Phải có requiredDate")
	@Temporal(TemporalType.DATE)
	@Column(name="required_date")
	private Date requiredDate;

	@Temporal(TemporalType.DATE)
	@Column(name="shipped_date")
	private Date shippedDate;
	
	@Column(name="status")
	private String status;

	@JsonIgnore
	@OneToMany(mappedBy="order", cascade = CascadeType.ALL)
	private List<OrderDetails> orderDetails;

	@ManyToOne
//	@JsonIgnore
	private Customers customer;

	public Orders() {
		
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public Date getRequiredDate() {
		return requiredDate;
	}

	public void setRequiredDate(Date requiredDate) {
		this.requiredDate = requiredDate;
	}

	public Date getShippedDate() {
		return shippedDate;
	}

	public void setShippedDate(Date shippedDate) {
		this.shippedDate = shippedDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<OrderDetails> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(List<OrderDetails> orderDetails) {
		this.orderDetails = orderDetails;
	}
	
//	@JsonIgnore
	public Customers getCustomer() {
		return customer;
	}

	public void setCustomer(Customers customer) {
		this.customer = customer;
	}
}
