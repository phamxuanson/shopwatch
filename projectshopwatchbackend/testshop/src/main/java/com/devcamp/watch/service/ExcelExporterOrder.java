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

import com.devcamp.watch.model.Orders;

public class ExcelExporterOrder {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private List<Orders> orders;

	/**
	 * Constructor khởi tạo server export danh sách Customer
	 * 
	 * @param customers
	 */
	public ExcelExporterOrder(List<Orders> orders) {
		this.orders = orders;
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
		sheet = workbook.createSheet("Orders");

		Row row = sheet.createRow(0);

		CellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontHeight(16);
		style.setFont(font);

		createCell(row, 0, "Order Date", style);
		createCell(row, 1, "Required Date", style);
		createCell(row, 2, "Shipped_date", style);
		createCell(row, 3, "Status", style);
		createCell(row, 4, "comments", style);

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

		for (Orders order : this.orders) {
			Row row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, order.getId(), style);
			createCell(row, columnCount++, order.getOrderDate(), style);
			createCell(row, columnCount++, order.getRequiredDate(), style);
			createCell(row, columnCount++, order.getShippedDate(), style);
			createCell(row, columnCount++, order.getStatus(), style);
			createCell(row, columnCount++, order.getComments(), style);

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
