import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../Services/doctor-service';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  specialization: string;
}

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors implements OnInit {
  doctors: Doctor[] = [];

  Math = Math;

  doctorForm!: FormGroup;
  showModal = false;
  isEditMode = false;
  editingId: number | null = null;

  // Delete modal
  showDeleteModal = false;
  deletingId: number | null = null;

  // Toast
  toast = { show: false, message: '', type: 'success' as 'success' | 'error' };
  private toastTimer: any;

  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 5;

  specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Radiology', 'Oncology', 'Psychiatry', 'Gynecology', 'Urology',
    'Endocrinology', 'Gastroenterology', 'General Practice', 'Surgery'
  ];

  constructor(private fb: FormBuilder, private doctorService: DoctorService, private cd: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDoctors();
  }

  initForm(): void {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      specialization: ['', Validators.required],
    });
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  showToast(message: string, type: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toast = { show: true, message, type };

    this.ngZone.run(() => {
      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
        this.cd.detectChanges(); // if using OnPush
      }, 3000);
    });
  }

  // ── API Calls ──────────────────────────────────────────────────────────────

  loadDoctors(): void {
    this.isLoading = true;
    this.doctorService.getAll().subscribe({
      next: (data) => {
        this.doctors = data;
        this.cd.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        this.showToast('Failed to load doctors. Please try again.', 'error');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // ── Computed ───────────────────────────────────────────────────────────────

  get totalPages(): number {
    return Math.ceil(this.doctors.length / this.pageSize);
  }

  get pagedDoctors(): Doctor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.doctors.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ── Pagination ─────────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.doctorForm.reset();
    this.showModal = true;
  }

  openEditModal(doctor: Doctor): void {
    this.isEditMode = true;
    this.editingId = doctor.id;
    this.doctorForm.patchValue(doctor);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.doctorForm.reset();
  }

  saveDoctor(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const formValue = this.doctorForm.value;
    this.isLoading = true;

    if (this.isEditMode && this.editingId !== null) {
      const payload: Doctor = { id: this.editingId, ...formValue };

      this.doctorService.update(this.editingId, payload).subscribe({
        next: () => {
          this.showToast('Doctor updated successfully.', 'success');
          this.loadDoctors();
          this.closeModal();
        },
        error: (err) => {
          this.showToast('Failed to update doctor. Please try again.', 'error');
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.doctorService.create(formValue).subscribe({
        next: () => {
          this.showToast('Doctor added successfully.', 'success');
          this.loadDoctors();
          this.closeModal();
        },
        error: (err) => {
          this.showToast('Failed to add doctor. Please try again.', 'error');
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  // ── Delete Modal ───────────────────────────────────────────────────────────

  openDeleteModal(id: number): void {
    this.deletingId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deletingId = null;
  }

  confirmDelete(): void {
    if (this.deletingId === null) return;

    this.isLoading = true;
    this.doctorService.delete(this.deletingId).subscribe({
      next: () => {
        this.showToast('Doctor deleted successfully.', 'success');
        this.loadDoctors();
        this.closeDeleteModal();
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      },
      error: (err) => {
        this.showToast('Failed to delete doctor. Please try again.', 'error');
        this.isLoading = false;
        console.error(err);
        this.closeDeleteModal();
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const ctrl = this.doctorForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.doctorForm.get(field);
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required']) return 'This field is required.';
    if (ctrl.errors['email']) return 'Enter a valid email address.';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors['pattern']) return 'Format: 555-0000';
    return 'Invalid value.';
  }
}