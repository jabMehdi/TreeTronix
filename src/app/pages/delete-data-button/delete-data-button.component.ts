import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-delete-data-button',
  template: `
    <button nbButton size="small" class="btn btn-danger" (click)="onDeleteData()">
      Del
    </button>
  `,
})
export class DeleteDataButtonComponent {
  @Input() rowData: any;
  @Output() deleteData: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  onDeleteData(): void {
    const id = this.rowData._id;
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http.post(`/api/sensors/sensor/Data_remID/${id}`, {}, options).subscribe(
      () => {
        // Data deleted successfully
        this.deleteData.emit(this.rowData);
      },
      (err: HttpErrorResponse) => {
        console.error('An error occurred while deleting data:', err);
      }
    );
  }
}
