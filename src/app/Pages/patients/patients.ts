import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../Services/PatientService';


export interface Patients {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  address?: string;
  diseases: string[];
  // password: string;
}

@Component({
  selector: 'app-patients',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class PatientsComponent implements OnInit {

  patients: Patients[] = [];
  filteredPatients: Patients[] = [];
  pagedPatients: Patients[] = [];

  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  showFormModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  Id: number | null = null;
  isLoading: boolean = false;

  toast = { show: false, message: '', type: 'success' };
  private toastTimer: any;

  // ── FORM GROUP ────────────────────────────────────────────────────────
  patientForm!: FormGroup;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  // ── STATS ─────────────────────────────────────────────────────────────
  get totalCount(): number { return this.patients.length; }
  get maleCount(): number { return this.patients.filter(p => p.gender === 'Male').length; }
  get femaleCount(): number { return this.patients.filter(p => p.gender === 'Female').length; }
  get uniqueDiseases(): number {
    return new Set(this.patients.flatMap(p => p.diseases)).size;
  }

  // ── LIFECYCLE ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPatients();
    this.initForm();
    console.log("HIII");

  }

  initForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-(). ]{7,}$/)]],
      address: [''],
      diseases: [''],
      // password: ['hiii']
    });
  }

  // ── HELPERS ───────────────────────────────────────────────────────────
  get f() { return this.patientForm.controls; }

  hasError(field: string, error: string): boolean {
    const control = this.patientForm.get(field);
    return !!(control?.hasError(error) && (control.dirty || control.touched));
  }

  isInvalid(field: string): boolean {
    const control = this.patientForm.get(field);
    return !!(control?.invalid && (control.dirty || control.touched));
  }

  // ── LOAD ──────────────────────────────────────────────────────────────
  loadPatients(): void {
    this.isLoading = true;
    this.patientService.getAll().subscribe({
      next: (data) => {
        console.log(data);

        // Normalize diseases to always be string[]
        this.patients = data.map(p => ({
          ...p,
          diseases: Array.isArray(p.diseases)
            ? p.diseases
            : p.diseases ? String(p.diseases).split(',').map(d => d.trim()) : []
        }));
        this.applyFilter();
        this.cd.detectChanges();  
        this.isLoading = false;
      },
      error: () => {
        this.showToast('Failed to load patients.', 'error');
        this.isLoading = false;
      }
    });
  }

  // ── SEARCH & PAGINATION ───────────────────────────────────────────────
  onSearch(event?: Event): void {
    if (event) {
      this.searchQuery = (event.target as HTMLInputElement).value;
    }
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.diseases.some(d => d.toLowerCase().includes(q))
    );
    this.totalPages = Math.max(1, Math.ceil(this.filteredPatients.length / this.pageSize));
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPatients = this.filteredPatients.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  get paginationStart(): number { return (this.currentPage - 1) * this.pageSize + 1; }
  get paginationEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filteredPatients.length); }

  // ── MODAL OPEN/CLOSE ──────────────────────────────────────────────────
  openAddModal(): void {
    this.isEditMode = false;
    this.Id = null;
    this.patientForm.reset();
    this.showFormModal = true;
  }

  openEditModal(patient: Patients): void {
    this.isEditMode = true;
    this.Id = patient.id;
    this.patientForm.setValue({
      name: patient.name,
      email: patient.email,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address ?? '',
      diseases: patient.diseases
    });
    this.showFormModal = true;
  }

  openDeleteModal(id: number): void {
    this.Id = id;
    this.showDeleteModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.patientForm.reset();
  }

  closeDeleteModal(): void { this.showDeleteModal = false; }


  createPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const { name, email, gender, phone, address, diseases } = this.patientForm.value;

    const payload: Patients = {
      id: 0,
      name,
      email,
      gender,
      phone,
      address: address || '',
      diseases: diseases
    };

    console.log('Create payload:', JSON.stringify(payload));

    this.patientService.create(payload).subscribe({
      next: () => {
        this.showToast('Patient added successfully.', 'success');
        this.closeFormModal();
        this.loadPatients();
      },
      error: (err) => {
        console.error('Create error:', err);
        this.showToast('Failed to add patient.', 'error');
      }
    });
  }

  updatePatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    if (this.Id === null) return;

    const { name, email, gender, phone, address, diseases } = this.patientForm.value;

    const payload: Patients = {
      id: this.Id,
      name,
      email,
      gender,
      phone,
      address: address || '',
      diseases: diseases
    };

    console.log('Update payload:', JSON.stringify(payload));

    this.patientService.update(this.Id, payload).subscribe({
      next: () => {
        this.showToast('Patient updated successfully.', 'success');
        this.closeFormModal();
        this.loadPatients();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.showToast('Failed to update patient.', 'error');
      }
    });
  }
  // ── DELETE ────────────────────────────────────────────────────────────
  confirmDelete(): void {
    if (this.Id === null) return;
    this.patientService.delete(this.Id).subscribe({
      next: () => {
        this.showToast('Patient deleted.', 'error');
        this.closeDeleteModal();
        this.loadPatients();
      },
      error: () => this.showToast('Failed to delete patient.', 'error')
    });
  }

  // ── TOAST ─────────────────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toast = { show: true, message, type };
    this.toastTimer = setTimeout(() => (this.toast.show = false), 3000);
  }

  padId(id: number): string {
    return '#' + String(id).padStart(3, '0');
  }
}