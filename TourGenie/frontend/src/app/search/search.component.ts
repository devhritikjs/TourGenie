import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule here
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and other directives
import { constants } from 'buffer';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, HttpClientModule] // Add HttpClientModule here
})
export class SearchComponent {
  constructor(private http: HttpClient) {}

  hardcodedPrompt: string = "What is the capital of inda?";
  response: string = '';
  prompt:string='';
  showResponse: boolean = false;
  isLoading: boolean = false; 
  errormessage: string='';
  ngOnInit() {
    //this.sendPrompt();
  }
  generateprompt(destination:string,origin:string,days:string){
    if (!destination || !origin || !days) {
      this.errormessage = "Please fill in all fields.";
      return;
    }
    this.errormessage = '';
    this.isLoading = true;
    // Create the travel prompt dynamically
    this.prompt = `I want to travel to ${destination}. Give me details on how I can travel from ${origin}, 
    what are the options for travel, and where I can spend time for a ${days}-day trip. Also include the costs.`;

    // Call sendPrompt with the generated prompt
    this.sendPrompt();
    console.log("prompt",this.prompt);
  }
  sendPrompt() {
    const url = 'http://localhost:3000/api/content';
    
    this.http.post<{ result: string }>(url, { question: this.prompt }).subscribe({
      next: (data) => {
        this.formatResponse(data.result);
        console.log("Response from server:", this.response);
        this.showResponse = true;
      },
      error: (err) => {
        console.error("Error occurred:", err);
        if (err.error && err.error.error) {
          console.error("Backend Error: ", err.error.error);
          this.isLoading = false;
        }
        this.isLoading = false;
      }
      
    });
  }

  formatResponse(rawResponse: string) {
    // Parse the response and format it with proper styling
    const formattedResponse = rawResponse
      .replace(/##\s*(.+)/g, '<h2>$1</h2>') // Format main headings
      .replace(/\*\*\s*(.+?):/g, '<strong>$1:</strong>') // Bolden key labels
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bolden phrases
      .replace(/\n/g, '<br>'); // Add line breaks for better readability
  
    this.response=formattedResponse
    this.isLoading = false;
    //console.log("formatted:",formattedResponse)
  }
  goBack() {
    this.showResponse = false; // Show the input form
    this.response = ''; // Clear the response
  }
}
