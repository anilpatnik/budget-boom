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
}

export function generateExpensePDF(options: PDFExportOptions) {
  const { expenses, startDate, endDate, countryId, currency, fileName } = options;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Expense Report", 14, 15);

  // Add date range
  doc.setFontSize(10);
  doc.text(
    `Period: ${dateHelper.dateFormat(startDate)} - ${dateHelper.dateFormat(endDate)}`,
    14,
    25
  );

  // Prepare table data
  const tableData = expenses.map(expense => {
    const category = lookupService.getCategory(expense.categoryId || "");
    const transactionType = (expense.price ?? 0) > 0 ? "Income" : "Expense";
    const amount = helper.formatPrice(expense.price ?? 0, countryId, currency);
    
    // Build row with conditional notes field
    const row: any[] = [
      dateHelper.dateFormat(expense.entryDate || ""),
      category.name || "",
      amount,
      transactionType
    ];

    // Add notes only if not empty
    if (expense.notes && expense.notes.trim()) {
      row.push(expense.notes);
    }

    return row;
  });

  // Determine if we have notes in any expense
  const hasNotes = expenses.some(e => e.notes && e.notes.trim());

  // Prepare table columns
  const columns = [
    { header: "Date", dataKey: "date" },
    { header: "Category", dataKey: "category" },
    { header: "Amount", dataKey: "amount" },
    { header: "Type", dataKey: "type" }
  ];

  if (hasNotes) {
    columns.push({ header: "Notes", dataKey: "notes" });
  }

  // Create table rows with proper column mapping
  const tableRows = expenses.map(expense => {
    const category = lookupService.getCategory(expense.categoryId || "");
    const transactionType = (expense.price ?? 0) > 0 ? "Income" : "Expense";
    const amount = helper.formatPrice(expense.price ?? 0, countryId, currency);

    const row: any = {
      date: dateHelper.dateFormat(expense.entryDate || ""),
      category: category.name || "",
      amount: amount,
      type: transactionType
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
      doc.text(
        `Page ${(doc as any).internal.pages.length}`,
        pageWidth - 30,
        pageHeight - 10
      );
    }
  });

  // Download PDF
  const timestamp = new Date().toISOString().split("T")[0];
  const downloadFileName = fileName || `expense-report-${timestamp}.pdf`;
  doc.save(downloadFileName);
}
