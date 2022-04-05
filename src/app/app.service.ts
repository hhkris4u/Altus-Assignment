import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  serverUrl: string = 'http://localhost:5502';
  constructor(private http: HttpClient) { }

  fetchUniqueSchools(): any {
    try {
      return this.http.get(`${this.serverUrl}/school/fetchunique`);
    } catch (error) {
      return error;
    }
  }
  fetchStudentGradeData(schoolName: string): any {
    try {
      return this.http.get(`${this.serverUrl}/school/getinfo/${schoolName}`);
    } catch (error) {
      return error;
    }
  }
}
