import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IExpense } from "@/models";
import { lookupService } from "@/services";
import { helper, dateHelper } from "@/utils";

export interface PDFExportOptions {
  expenses: IExpense[];
  startDate: string;
  endDate: string;
  countryId: string;
  currency: string;
  fileName?: string;
  isTaxable?: boolean;
}

export function generateExpensePDF(options: PDFExportOptions) {
  const { expenses, startDate, endDate, countryId, currency, fileName, isTaxable } = options;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  let titleText = "Expense Report";
  if (isTaxable) {
    titleText += " (Taxed)";
  }
  doc.text(titleText, 14, 15);

  // Add date range
  doc.setFontSize(10);
  if (startDate && endDate) {
    doc.text(
      `Period: ${dateHelper.dateFormat(startDate)} - ${dateHelper.dateFormat(endDate)}`,
      14,
      25
    );
  } else {
    doc.text("Period: All time", 14, 25);
  }

  // Determine if we have notes in any expense
  const hasNotes = expenses.some(e => e.notes && e.notes.trim());

  // Prepare table columns
  const columns = [
    { header: "Date", dataKey: "date" },
    { header: "Category", dataKey: "category" },
    { header: "Amount", dataKey: "amount" },
    { header: "Type", dataKey: "type" },
    { header: "Tax", dataKey: "tax" }
  ];

  if (hasNotes) {
    columns.push({ header: "Notes", dataKey: "notes" });
  }

  // Create table rows with proper column mapping
  const tableRows = expenses.map(expense => {
    const category = lookupService.getCategory(expense.categoryId || "");
    const transactionType = (expense.price ?? 0) > 0 ? "Income" : "Expense";
    const amount = helper.formatPrice(expense.price ?? 0, countryId, currency);
    const taxIndicator = expense.isTaxable ? "Yes" : "No";

    const row: any = {
      date: dateHelper.dateFormat(expense.entryDate || ""),
      category: category.name || "",
      amount: amount,
      type: transactionType,
      tax: taxIndicator
    };

    if (hasNotes && expense.notes && expense.notes.trim()) {
      row.notes = expense.notes;
    }

    return row;
  });

  // Add table
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: tableRows.map(row => columns.map(col => row[col.dataKey] || "")),
    startY: 35,
    margin: { top: 35, right: 14, bottom: 14, left: 14 },
    didDrawPage: () => {
      // Footer
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.getHeight();
      const pageWidth = pageSize.getWidth();
      doc.setFontSize(8);
      doc.text(`Generated on ${dateHelper.dateFormat(new Date())}`, 14, pageHeight - 10);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 30, pageHeight - 10);
    }
  });

  // Download PDF
  const generateGUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const downloadFileName = fileName || `${generateGUID()}.pdf`;
  doc.save(downloadFileName);
}
