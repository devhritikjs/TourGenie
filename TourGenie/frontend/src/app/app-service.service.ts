import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  private apiUrl = 'http://localhost:3000/api/content'; // Backend API URL

  constructor(private http: HttpClient) { }

  // Function to send the prompt to the backend and get the response
  sendPrompt(question: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiUrl, { question });
  }
}
