package com.devcamp.watch.model;

import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "customers")
public class Customers {
	
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty(message = "Phải có mã lastname")
	@Column(name="last_name")
	private String lastName;
	
	@NotEmpty(message = "Phải có mã firstname")
	@Column(name="first_name")
	private String firstName;
	
	@NotEmpty(message = "Phải có phone number")
	@Column(name="phone_number")
	private String phoneNumber;
	
	@NotEmpty(message = "Phải có address")
	@Column(name="address")
	private String address;
	
	@NotEmpty(message = "Phải có city")
	@Column(name="city")
	private String city;
	
	@NotEmpty(message = "Phải có state")
	@Column(name="state")
	private String state;
	
	@NotEmpty(message = "Phải có email")
	@Column(name="email")
	private String email;
	
	@JsonIgnore
	@OneToMany(targetEntity = Orders.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "customer_id")
	private List<Orders> orders;
	

	@OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

	@OneToMany(mappedBy="customer", targetEntity = Rate.class)
	private List<Rate> rates;
	


	@JsonIgnore
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Customers() {
		
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	public List<Orders> getOrders() {
		return orders;
	}

	public void setOrders(List<Orders> orders) {
		this.orders = orders;
	}
	
}
