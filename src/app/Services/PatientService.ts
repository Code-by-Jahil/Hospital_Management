import { Observable } from "rxjs";
import { Patients } from "../Pages/patients/patients";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";




@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private apiUrl = 'https://localhost:44377/api';
  patientCreateApi = `${this.apiUrl}/Patient/Create`;
  patientUpdateApi = `${this.apiUrl}/Patient/Update/`;
  patientDeleteApi = `${this.apiUrl}/Patient/Delete`;
  patientGetAllApi = `${this.apiUrl}/Patient/GetAll`;
  patientGetByIdApi = `${this.apiUrl}/Patient/GetById`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Patients[]> {
    return this.http.get<Patients[]>(this.patientGetAllApi);
  }

  getById(id: number): Observable<Patients> {
    return this.http.get<Patients>(`${this.patientGetByIdApi}/${id}`);
  }

  create(patient: Patients): Observable<Patients> {
    return this.http.post<Patients>(this.patientCreateApi, patient);
  }

  update(id: number, patient: Patients): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Patient/Update`, patient, { params: { id } });
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Patient/Delete`, { params: { id } });
  }
}