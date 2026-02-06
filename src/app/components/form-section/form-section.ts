import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../ui/input';
import { SelectComponent } from '../ui/select';
import { TextareaComponent } from '../ui/textarea';
import { PDFService } from '../../services/pdf.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-form-section',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './form-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSection {
  // dependencies
  private readonly fb = inject(FormBuilder);
  private readonly pdfService = inject(PDFService);

  readonly pageSizeOptions = [
    { label: 'A4', value: 'A4' },
    { label: 'A5', value: 'A5' },
    { label: 'Letter', value: 'Letter' },
  ];

  // properties
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    pageSize: ['A4', [Validators.required]],
    nominal: [null as number | null, [Validators.required]],
    desc: ['', [Validators.required, Validators.minLength(10)]],
  });

  isGenerating = signal(false);

  // methods
  async onSubmit() {
    if (this.form.valid && !this.isGenerating()) {
      this.isGenerating.set(true);

      try {
        const rawValue = this.form.getRawValue();

        // Add a small delay for better UX visibility
        await new Promise((resolve) => setTimeout(resolve, 600));

        this.pdfService.generatePDF({
          title: rawValue.title as string,
          pageSize: rawValue.pageSize as string,
          nominal: Number(rawValue.nominal),
          desc: rawValue.desc as string,
        });

        toast.success('Laporan berhasil di-generate!', {
          description: `PDF "${rawValue.title}" telah ditambahkan ke history.`,
        });

        // Reset form but keep default page size
        this.form.reset({
          pageSize: 'A4',
        });
      } catch (error) {
        toast.error('Gagal generate PDF!', {
          description: 'Terjadi kesalahan sistem, silakan coba lagi.',
        });
      } finally {
        this.isGenerating.set(false);
      }
    }
  }
}
