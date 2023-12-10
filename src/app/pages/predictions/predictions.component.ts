// predictions.component.ts
import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SensorService } from '../services/sensor.service';
import { format, parseISO } from 'date-fns';
import { formatDate } from '@angular/common';
import { NbDatepicker } from '@nebular/theme';
declare var Chart: any;

@Component({
  selector: 'app-predictions-form',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionComponent implements AfterViewInit, OnDestroy {
  @Input() predictions: { time: string; value: number }[] = [];
  sensorForm: FormGroup;
  predictedValue: number | null = null;
  sensorTypes = ['AN-103A', 'triphase'];
  fieldOptions: { [key: string]: string[] } = {
    'AN-103A': ['Temperature', 'Humidity', 'Voltage'],
    'triphase': ['Consumption'],
  };

  @ViewChild('chart', { static: true }) chartRef: ElementRef;
  private chart: Chart; // Store the chart instance
  predictionForm: FormGroup;
  showPredictionForm: boolean = true;

  constructor(private fb: FormBuilder, private sensorService: SensorService) {
    this.createForm();
    this.createPredictionForm();
  }

  ngAfterViewInit() {
    // Initialize the chart when the component is created
    this.initializeChart();
  }

  ngOnDestroy() {
    // Ensure the chart is destroyed when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
  }
  createPredictionForm() {
    this.predictionForm = this.fb.group({
      predictionDateTime: ['', Validators.required],
    });
  }
  createForm() {
    this.sensorForm = this.fb.group({
      sensorType: ['', Validators.required],
      field: ['', Validators.required]
    });
  }

  

  private parseChartData() {
    const labels = this.predictions.map(prediction => format(parseISO(prediction.time), 'yyyy-MM-dd HH:mm:ss'));
    const data = this.predictions.map(prediction => prediction.value);

    console.log('Labels:', labels);
    console.log('Data:', data);

    return { labels, data };
  }

  private initializeChart() {
    const chartElement = this.chartRef.nativeElement;
    const chartData = this.parseChartData();
    console.log('ChartData:', chartData);

    this.chart = new Chart(chartElement, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Predictions',
          data: chartData.data,
          borderColor: '#ffff',
          borderWidth: 1,
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time', 
            position: 'bottom',
            title: {
              display: true,
              text: 'Time',
            }
            },
          y: {
            title: {
              display: true,
              text: 'Prediction Value',
            },
          },
        },
      },
    });
  }

  onSubmit() {
    if (this.sensorForm.valid) {
      const formValue = this.sensorForm.value;
      const { sensorType, field } = formValue;
      const adjustedField = (sensorType === 'triphase' && ['Temperature', 'Humidity', 'Voltage', 'Consumption'].includes(field))
        ? 'Consumption'
        : field;
  
  
      this.sensorService.findByCodeAndTest(sensorType, adjustedField)
        .subscribe(
          (response: any) => {
            console.log('Success:', response);
  
            if (response && response.formattedPredictions && response.formattedPredictions.length > 0) {
              // Assign formatted predictions to the component variable
              this.predictions = response.formattedPredictions;
              console.log('Predictions:', this.predictions);
  
              // Destroy the existing chart before initializing a new one
              if (this.chart) {
                this.chart.destroy();
              }
  
              // Clear the canvas element
              const canvas: HTMLCanvasElement = this.chartRef.nativeElement;
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
  
              // Initialize the new chart
              this.initializeChart();
            } else {
              console.error('No valid predictions found in the response.');
            }
          },
          (error: any) => {
            console.error('Error:', error);
            // Display error message to the user
          }
        );
    } else {
      console.error('Form is invalid. Please fill all required fields.');
    }
  }
  
  onPredict() {
    if (this.predictionForm.valid) {
      const formValue = this.predictionForm.value;
      const { sensorType, field } = this.sensorForm.value;
      const predictionDateTime = formatDate(formValue.predictionDateTime, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      const adjustedField = (sensorType === 'triphase' && ['Temperature', 'Humidity', 'Voltage', 'Consumption'].includes(field))
  ? 'Consumption'
  : field;

      console.log('Prediction Form Value:', formValue); // Check the form value
      console.log('Sensor Type:', sensorType);
      console.log('Field:', field);
      console.log('Prediction Date Time:', predictionDateTime);
  
      // Make the prediction request here
      this.sensorService.findByCodeAndPred(sensorType, adjustedField, predictionDateTime).subscribe(
        (response: any) => {
          console.log('Prediction Success:', response);
          let predictedValue = null;
          if (response && response.status === 'success') {
            // Extract the predicted value and update the UI
            if(adjustedField==='Temperature'){
              predictedValue = response.predicted_temperature
            }
            else if(adjustedField==='Humidity'){
              predictedValue = response.predicted_humidity
            }
            else if(adjustedField==='Voltage'){
              predictedValue = response.predicted_voltage
            }
            else if(adjustedField==='Consumption'){
              predictedValue = response.predicted_consumption
            }
           
            console.log('Predicted Value:', predictedValue);
  
            // Update the UI with the predicted value, e.g., display in a div
            this.predictedValue = predictedValue;
          } else {
            console.error('No valid prediction found in the response.');
          }
        },
        (error: any) => {
          console.error('Prediction Error:', error);
          // Display error message to the user
        }
      );
    } else {
      console.error('Prediction Form is invalid. Please select a prediction date and time.');
    }
  }


}
