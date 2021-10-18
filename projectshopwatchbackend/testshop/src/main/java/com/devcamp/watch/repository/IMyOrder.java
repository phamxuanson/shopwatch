package com.devcamp.watch.repository;


public interface IMyOrder {

	public long getOrderid();
	
	public long getOrderdetailid();
	
	public long getCustomerid();
	
	public long getProductid();
	
	public String getProductname();
	
	public String getProductimage();
	
	public int getQuantityorder();
	
	public int getPrice();
}
