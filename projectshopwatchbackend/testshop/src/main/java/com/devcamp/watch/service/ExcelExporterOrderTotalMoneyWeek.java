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


import com.devcamp.watch.repository.IOrderTotalMoneyWeek;

public class ExcelExporterOrderTotalMoneyWeek {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;
	private List<IOrderTotalMoneyWeek> IOrderTotalMoneyWeek;

	/**
	 * Constructor khởi tạo server export danh sách Customer
	 * 
	 * @param customers
	 */
	public ExcelExporterOrderTotalMoneyWeek(List<IOrderTotalMoneyWeek> IOrderTotalMoneyWeek) {
		this.IOrderTotalMoneyWeek = IOrderTotalMoneyWeek;
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

		createCell(row, 0, "Week number", style);
		createCell(row, 1, "Year", style);
		createCell(row, 2, "Total money", style);


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

		for (IOrderTotalMoneyWeek IOrderTotalMoneyWeeks : this.IOrderTotalMoneyWeek) {
			Row row = sheet.createRow(rowCount++);
			int columnCount = 0;

			createCell(row, columnCount++, IOrderTotalMoneyWeeks.getEweek(), style);
			createCell(row, columnCount++, IOrderTotalMoneyWeeks.getEyear(), style);
			createCell(row, columnCount++, IOrderTotalMoneyWeeks.getTotalmoney(), style);

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
