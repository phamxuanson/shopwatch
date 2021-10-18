package com.devcamp.watch.model;

import java.util.Date;

import javax.persistence.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="rates")
public class Rate {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name="rate_score")
	private int rateScore;
	
	@Column(name="comments")
	private String comments;
	
	@Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", nullable = true, updatable = false)
    @CreatedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "update_date", nullable = true)
    @LastModifiedDate
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date updateDate;
    
    @ManyToOne
    private Customers customer;
	
	@OneToOne(optional = false)
    @JoinColumn(name = "orderdetails_id")
    private OrderDetails orderdetails;
	
	@ManyToOne
	@JsonIgnore
	private Products product;
	
	public Rate() {
		
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getRateScore() {
		return rateScore;
	}

	public void setRateScore(int rateScore) {
		this.rateScore = rateScore;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Customers getCustomer() {
		return customer;
	}
	
	//them
//	@JsonIgnore
	public void setCustomer(Customers customer) {
		this.customer = customer;
	}

	public OrderDetails getOrderdetails() {
		return orderdetails;
	}

	public void setOrderdetails(OrderDetails orderdetails) {
		this.orderdetails = orderdetails;
	}

	public Products getProduct() {
		return product;
	}

	public void setProduct(Products product) {
		this.product = product;
	}
}
