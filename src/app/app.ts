import { Component, signal } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Header } from './components/layouts/header/header';
import { FormSection } from './components/form-section/form-section';
import { TableSection } from './components/table-section/table-section';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Header, FormSection, TableSection, NgxSonnerToaster],
})
export class App {
  protected readonly title = signal('pdf-generator');
}
