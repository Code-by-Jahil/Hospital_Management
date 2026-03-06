import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctors } from '../Pages/doctors/doctors';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  specialization: string;
}

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private apiUrl = 'https://localhost:44377/api';
  doctorCreateApi = `${this.apiUrl}/Doctor/Create`;
  doctorUpdateApi = `${this.apiUrl}/Doctor/Update/`;
  doctorDeleteApi = `${this.apiUrl}/Doctor/Delete`;
  doctorGetAllApi = `${this.apiUrl}/Doctor/GetAll`;
  doctorGetByIdApi = `${this.apiUrl}/Doctor/GetById`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorGetAllApi);
  }

  getById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.doctorGetByIdApi}/${id}`);
  }

  create(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.doctorCreateApi, doctor);
  }

  update(id: number, doctor: Doctor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Doctor/Update`, doctor, { params: { id } });
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Doctor/Delete`, { params: { id } });
  }
}
