package com.devcamp.watch.service;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.devcamp.watch.repository.ICustomerLevel;

public class ExcelExporterCustomerLevel {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private List<ICustomerLevel> customers;

	/**
	 * Constructor khởi tạo server export danh sách Customer
	 * 
	 * @param customers
	 */
	public ExcelExporterCustomerLevel(List<ICustomerLevel> customers) {
		this.customers = customers;
		workbook = new XSSFWorkbook();
	}

	/**
	 * Tạo các ô cho excel file.
	 * 
	 * @param row
	 * @param columnCount
	 * @param value
	 * @param style
	 */
	private void createCell(Row row, int columnCount, Object value, CellStyle style) {
		sheet.autoSizeColumn(columnCount);
		Cell cell = row.createCell(columnCount);
		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else {
			cell.setCellValue( value.toString());
		}
		cell.setCellStyle(style);
	}

	/**
	 * Khai báo cho sheet và các dòng đầu tiên
	 */
	private void writeHeaderLine() {
		sheet = workbook.createSheet("Customers");

		Row row = sheet.createRow(0);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontHeight(16);
		style.setFont(font);

		createCell(row, 0, "customer ID", style);
		createCell(row, 1, "Phone", style);
		createCell(row, 2, "First Name", style);
		createCell(row, 3, "Last Name", style);
		createCell(row, 4, "Address", style);
		createCell(row, 5, "Email", style);
		
	}

	/**
	 * fill dữ liệu cho các dòng tiếp theo.
	 */
	private void writeDataLines() {
		int rowCount = 1;

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setFontHeight(14);
		style.setFont(font);

		for (ICustomerLevel user : this.customers) {
			Row row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, user.getId(), style);
			createCell(row, columnCount++, user.getPhoneNumber(), style);
			createCell(row, columnCount++, user.getFirstName(), style);
			createCell(row, columnCount++, user.getLastName(), style);
			createCell(row, columnCount++, user.getAddress(), style);
			createCell(row, columnCount++, user.getEmail(), style);
		}
	}

	/**
	 * xuất dữ liệu ra dạng file
	 * 
	 * @param response
	 * @throws IOException
	 */
	public void export(HttpServletResponse response) throws IOException {
		writeHeaderLine();
		writeDataLines();

		ServletOutputStream outputStream = response.getOutputStream();
		workbook.write(outputStream);
		workbook.close();

		outputStream.close();

	}
}
