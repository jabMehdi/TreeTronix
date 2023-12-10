import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LicenseService } from '../services/license.services';
import Swal from 'sweetalert2';

interface Factory {
  _id: string;
  name: string;
  // Add other properties as needed
}
interface License {
  _id: string;
  factoryId: string;
  endDate: Date;
  status: string;
  activationKey: string;
  factory: Factory;
  // Add other fields as needed
}



@Component({
  selector: 'ngx-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {

  constructor(private http: HttpClient, private formBuilder: FormBuilder,private licenseService: LicenseService) { }
  
  AllLicensesUrl = '/api/license/all';
  NbSensorsUrl = '/api/sensors/sensor/nbS';
  findFactoryByuser = '/api/Factories/factory/ByUser';
  ReclamationUrl = 'api/Reclamations/Reclamation/add';
  activateLicenseUrl = '/api/license/activate';
  

  submitted = false;
  factories: Factory[] = []; // Array to store factories
  Resp: any;
  Licenses: License[] = [];

  licenseForm = new FormGroup({
    message: new FormControl('Factory name: \n Date fin: \n Nb appareils: \n'),
    subject: new FormControl('Demande License'),
    selectedFactory: new FormControl('', Validators.required),
    selectedDate: new FormControl('', Validators.required),
    numberOfDevices: new FormControl('0'),
    activationKey: new FormControl('', Validators.required),
  });

  settings = {
      add: {
        addButtonContent: '<i class="nb-checkmark" aria-placeholder="recherche" hidden></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" hidden></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
    columns: {
      endDate: {
        title: 'endDate',
        type: 'Date',
      },
      Factory: {
        title: 'factory Name',
        type: 'string',
      },
      status: {
        title: 'status',
        type: 'string',
      }
    },
  };


  ngOnInit(): void {
    // Load factories when the component initializes
    this.loadFactories();
    this.loadNumberOfDevices();
    this.loadLicenses();
    
  }

  loadLicenses() {
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http.post<License[]>(this.AllLicensesUrl, {}, options).subscribe(
      responseData => {
        const resSTR = JSON.stringify(responseData);
        const resJSON = JSON.parse(resSTR);
        this.Resp = resJSON;

        // Set the license status in the LicenseService
        if (this.Resp && this.Resp.length > 0) {
          this.licenseService.setLicenseStatus(this.Resp[0].status);
        }
      },
      error => {
        console.error('Error loading licenses:', error);
      }
    );
  }
  
// Assuming this is where you activate the license
onActivate() {
  // Assuming you have an API endpoint for license activation
  const options = {
    params: new HttpParams().append('token', localStorage.getItem('token')),
  };

  const activationKey = this.licenseForm.get('activationKey').value;

  this.http.post(this.activateLicenseUrl, { activationKey }, options).subscribe(
    data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'success') {
        // Set the license status to 'Active'
        this.licenseService.setLicenseStatus('Active');

        Swal.fire(
          'Success!',
          'License activated successfully.',
          'success',
        );
        this.loadLicenses(); // Refresh the licenses after activation
        this.licenseForm.get('activationKey').reset(); // Clear the license key field
      } else {
        Swal.fire(
          'Error!',
          'Failed to activate the license. Please check the key.',
          'error',
        );
      }
    },
    error => {
      console.error('Error activating license:', error);
    }
  );
}


  loadFactories() {
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http.post<Factory[]>(this.findFactoryByuser, {}, options).subscribe(
      data => {
        this.factories = data;

      },
      error => {
        console.error('Error loading factories:', error);
      }
    );
  }
 
  //load the number of devices from the server
  loadNumberOfDevices() {
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    this.http.post<{ count: number }>(this.NbSensorsUrl, {}, options).subscribe(
      data => {
        console.log('Number of devices:', data.count);
        this.licenseForm.get('numberOfDevices').setValue(data.count);
      },
      error => {
        console.error('Error loading number of devices:', error);
      }
    );
  }


  onRequest() {
    this.submitted = true;
  
    const options = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
  
    // Get the selected factory and date from the form
    const selectedFactory = this.licenseForm.get('selectedFactory').value;
    const selectedDate = this.licenseForm.get('selectedDate').value;
    const numberOfDevices = this.licenseForm.get('numberOfDevices').value;
    // Construct the message dynamically
    const message = `Factory name: ${selectedFactory.name}\nDate fin: ${selectedDate}\nNb devices: ${numberOfDevices}\n`;
  
    this.http.post(this.ReclamationUrl, {
      message: message,
      subject: this.licenseForm.get('subject').value, // Assuming you want to send the factory ID
    }, options).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      if (resJSON.status === 'err') {
        Swal.fire(
          'error!',
          'Please write subject and message',
          'error',
        );
      } else {
        Swal.fire(
          'Success!',
          'Your Reclamation is Sent with success.',
          'success',
        );
        this.licenseForm.reset();
      }
    }, error => {
      // Handle error if needed
    });
  }

  onDeleteConfirm(event): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won"t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.http.delete('/api/license/del/' + event.data.id ).subscribe();
        event.confirm.resolve();
        Swal.fire(
          'Success!',
          'Your License has been deleted.',
          'success',
        );
      }
    });
  }

}
