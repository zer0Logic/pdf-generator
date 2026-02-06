import { Injectable, signal, effect } from '@angular/core';
import { jsPDF } from 'jspdf';

export interface PDFRecord {
  id: string;
  title: string;
  pageSize: string;
  nominal: number;
  desc: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PDFService {
  private readonly STORAGE_KEY = 'pdf_gen_history';

  // History state using Signal
  private _history = signal<PDFRecord[]>(this.loadFromStorage());
  readonly history = this._history.asReadonly();

  constructor() {
    // Sync to localStorage whenever history changes
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._history()));
    });
  }

  generatePDF(data: { title: string; pageSize: string; nominal: number; desc: string }) {
    const createdAt = new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const newRecord: PDFRecord = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt,
    };

    // Add to history
    this._history.update((prev) => [newRecord, ...prev]);
  }

  clearHistory() {
    this._history.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  deleteRecord(id: string) {
    this._history.update((prev) => prev.filter((r) => r.id !== id));
  }

  downloadRecord(record: PDFRecord) {
    const doc = this.getPDFDoc(record);
    doc.save(`${record.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  }

  getPDFDoc(record: PDFRecord): jsPDF {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: record.pageSize.toLowerCase(),
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const bottomMargin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Content positioning
    let y = 20;
    const lineHeight = 6; // Standard line height for 11pt font

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(22);
    doc.text(record.title, margin, y);
    y += 15;

    // Info
    doc.setFontSize(11);
    doc.text(`Ukuran Halaman: ${record.pageSize}`, margin, y);
    y += 7;
    doc.text(`Nominal: Rp ${record.nominal.toLocaleString('id-ID')}`, margin, y);
    y += 7;
    doc.text(`Tanggal: ${record.createdAt}`, margin, y);
    y += 10;

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Description Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deskripsi:', margin, y);
    doc.setFont('helvetica', 'normal');
    y += 10;

    // Description Content
    doc.setFontSize(11);
    const splitDesc: string[] = doc.splitTextToSize(record.desc, contentWidth);

    splitDesc.forEach((line) => {
      checkPageBreak(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    });

    return doc;
  }

  private loadFromStorage(): PDFRecord[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
