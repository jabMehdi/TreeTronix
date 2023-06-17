import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-decoder-button',
  templateUrl: './decode-button.component.html',
  styleUrls: ['./decode-button.component.scss'],
})
export class DecoderButtonComponent {
  constructor(private router: Router) {}

  @Input() rowData: any;

 navigateToDecoder(): void {
  const sensorCode = this.rowData.code;
  const sensorId = this.rowData._id;
  this.router.navigate(['pages/decoders', sensorCode, sensorId]);
}
}
