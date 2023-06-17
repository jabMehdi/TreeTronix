import { Component, OnInit } from '@angular/core';
import { DashService } from '../dashboard/dash.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'ngx-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})

export class FactureComponent implements OnInit {

    DeviceName;
    DeviceType;
    Data=[];
    Production;
    Consumption;
   
    DateDay:Date;
    dateF:Date;
    dateD:Date;
    total;
    time1 ;
    userEmail:string;
    time2;time3;time4;consumptionFirstPeriode;consumptionSecondPeriode
    ;consumptionThirdPeriode;consumptionFourthPeriode
    
  price1;price2;vmin1;vmin2;  price11;price12;price13;price3;price4;
  
  constructor(private dashService :DashService) { 
   const DataDate:Date=new Date(Date.now())
   var min ;
   this.userEmail=localStorage.getItem('Useremail')
   this.userEmail.replace('"', '')
   console.log("email   : "+this.userEmail)
   
  this.DateDay= this.DateDisplay(this.DateDay)

    this.dashService.FactureData.subscribe(data=>{
      this.Data=data
      console.log
      var DD:Date=new Date(this.Data[6]);
      var DF:Date=new Date(this.Data[7]);
    this.DeviceName=this.Data[0];
    this.DeviceType=this.Data[1];
    this.Consumption=this.Data[4]
    this.Production=this.Data[5];
    this.total=this.Data[10]
    this.dateD=this.DateDisplay(DD);
    this.dateF=this.DateDisplay(DF);
    

    this.price1=this.Data[2];
    this.price2=this.Data[3];
    
    this.vmin1=this.Data[11];
    this.vmin2=this.Data[12];
    this.price11=this.Data[13]
    this.price12=this.Data[14]
    this.price13=this.Data[15]
    this.consumptionFirstPeriode=this.Data[16];
    this.consumptionSecondPeriode=this.Data[17];
    this.consumptionThirdPeriode=this.Data[18];
    this.consumptionFourthPeriode=this.Data[19];
    this.time3=this.Data[20];
    this.time4=this.Data[21];
    this.price3=this.Data[22];
    this.price4=this.Data[23];
    console.log("price24: ")

    

    this.time1=this.Data[8];
    this.time2=this.Data[9];
    console.log("vmin1: "+this.vmin1)
    console.log("vmin2: "+this.vmin2)

    console.log("DateD: "+this.dateD)
    console.log("DateF: "+this.dateF);

    

console.log('name: '+this.DeviceName+"  type" +this.DeviceType )

    })
  }

  ngOnInit() {
  }
  DateDisplay(DataDate:Date=new Date()){
    var min,DateDay;
    DataDate.getMinutes() > 10 ?
   (min = DataDate.getMinutes()) : min = '0' + DataDate.getMinutes();
    DateDay=DataDate.getFullYear() + '/' + (DataDate.getMonth() + 1)
    + '/' + DataDate.getDate() + ' , '
    + DataDate.getHours() + ':' + min + ' '
    return(DateDay)
  }
  Download(){
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Facture.pdf');
    });
  }
}
