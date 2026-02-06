import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { PDFService, PDFRecord } from '../../services/pdf.service';
import { PDFPreviewComponent } from '../ui/pdf-preview';
import { ButtonComponent } from '../ui/button';
import { ConfirmDialogComponent, ConfirmDialogData } from '../ui/confirm-dialog';
import { toast } from 'ngx-sonner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideEye, lucideTrash } from '@ng-icons/lucide';

@Component({
  selector: 'app-table-section',
  templateUrl: './table-section.html',
  imports: [CdkTableModule, CurrencyPipe, DialogModule, NgIcon, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEye, lucideDownload, lucideTrash })],
})
export class TableSection {
  protected readonly pdfService = inject(PDFService);
  private readonly dialog = inject(Dialog);

  readonly displayedColumns = ['no', 'title', 'pageSize', 'nominal', 'createdAt', 'actions'];
  readonly dataSource = computed(() => this.pdfService.history());

  onPreview(record: PDFRecord) {
    const doc = this.pdfService.getPDFDoc(record);
    this.dialog.open(PDFPreviewComponent, {
      data: { record, doc },
    });
  }

  onClearHistory() {
    const dialogRef = this.dialog.open<boolean, ConfirmDialogData>(ConfirmDialogComponent, {
      data: {
        title: 'Hapus Semua History',
        message:
          'Apakah Anda yakin ingin menghapus semua history generate? Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Ya, Hapus Semua',
        cancelText: 'Batal',
        variant: 'danger',
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        try {
          this.pdfService.clearHistory();
          toast.success('History berhasil dihapus!', {
            description: 'Semua data generate PDF telah dibersihkan.',
          });
        } catch (error) {
          toast.error('Gagal menghapus history!', {
            description: 'Terjadi kesalahan saat mencoba membersihkan data.',
          });
        }
      }
    });
  }

  onDelete(record: PDFRecord) {
    const dialogRef = this.dialog.open<boolean, ConfirmDialogData>(ConfirmDialogComponent, {
      data: {
        title: 'Hapus Laporan',
        message: `Apakah Anda yakin ingin menghapus laporan "${record.title}"?`,
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        variant: 'danger',
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        try {
          this.pdfService.deleteRecord(record.id);
          toast.success('Laporan berhasil dihapus!');
        } catch (error) {
          toast.error('Gagal menghapus laporan!');
        }
      }
    });
  }

  downloadPDF(record: PDFRecord) {
    this.pdfService.downloadRecord(record);
  }
}
