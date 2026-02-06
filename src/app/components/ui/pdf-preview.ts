import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFRecord } from '../../services/pdf.service';
import { jsPDF } from 'jspdf';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-pdf-preview',
  imports: [NgIcon],
  template: `
    <div
      class="flex h-[85vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-stone-100 px-6 py-4">
        <h2 class="text-lg font-bold text-stone-900">Preview PDF: {{ data.record.title }}</h2>
        <button
          (click)="dialogRef.close()"
          class="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
        >
          <ng-icon name="lucideX" size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 bg-stone-50">
        @if (pdfUrl) {
          <iframe
            [src]="pdfUrl"
            class="h-full w-full rounded border border-stone-200 shadow-sm"
          ></iframe>
        } @else {
          <div class="flex h-full items-center justify-center text-stone-400">
            Generating preview...
          </div>
        }
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-stone-100 px-6 py-4">
        <button
          (click)="dialogRef.close()"
          class="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          Tutup
        </button>
        <button
          (click)="download()"
          class="flex items-center gap-2 rounded-lg bg-lime-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-700"
        >
          <ng-icon name="lucideDownload" size="16" />
          Download PDF
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideX })],
})
export class PDFPreviewComponent implements OnInit {
  readonly dialogRef = inject(DialogRef);
  readonly data = inject<{ record: PDFRecord; doc: jsPDF }>(DIALOG_DATA);
  private readonly sanitizer = inject(DomSanitizer);

  protected pdfUrl: SafeResourceUrl | null = null;

  ngOnInit() {
    // Convert jsPDF to Blob URL
    const blob = this.data.doc.output('blob');
    const url = URL.createObjectURL(blob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  download() {
    this.data.doc.save(`${this.data.record.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    this.dialogRef.close();
  }
}
