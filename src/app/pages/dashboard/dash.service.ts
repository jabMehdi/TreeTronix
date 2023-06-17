import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as io from 'socket.io-client';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { Socket }  from 'ngx-socket-io';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class DashService {
 
 
 
 
  documents = this.socket.fromEvent<string[]>('documents');
  ChartUpdate = io.connect('http://localhost:3007/Sensor/UpdateValue');
  sock = io.connect('http://localhost:3007/');
  private ChartUpdateSource = new BehaviorSubject<any>({value : 'nan'});
  ChartUpdateValue = this.ChartUpdateSource.asObservable();
   
  updateChartRequired = true;
  
  an302: any = {
  IdSensor: '02',
  SType: '02',
  FrameForm: '00',
  Status: '00000000',
  satutsBButon: '000',
  satutsDismantle: '1',
  satutsBatterie: '--',
  satutsSensor: '0'}

  an103a: any = { }
  
  an303: any = { }

  an301: any = 
  { 
    AlarmState:'00'

  }

  lt22: any ={ 
    AVI1: '22',
    AVI2: '15',
    ACI1: '500',
    ACI2: '450',
    RO1: '01',
    RO2: '00',
    DI3: '01',
    DI2: '00s',
    DI1: '01',


  }

  an305a: any = {
    IdSensor: '08',
    FrameType: '01',
    STamper: '01',
    DoorContactStatus: '01',
    BatteryLevel: '--',
    }

    an304c: any = {
      IdSensor: '07',
      FrameType: '02',
      SSensor: '00',
      SDismantle: '00',
      BatteryLevel: '--',
      }


  constructor( private socket:Socket) {
    this.socket.on('SetSmoke',(data)=>{
      var time=new Date(data.data.time)
      var alarmTime=" "
       alarmTime=time.getMonth()+'/'+time.getDate()+"/"+time.getFullYear()+"  "+time.getHours()+":"+time.getMinutes()
      console.log("socket from server: "+alarmTime)
    console.log(data.area)
    console.log(data.factory)
      var  tram={"time":alarmTime,
    "state":data.data.state,"factory":data.factory,"area":data.area,"code":data.code}
      this.smokeStat(tram)
      
    //  return(alarmTime)
    })
    this.socket.on('AN-302',(data)=>{
    console.log("aaaaaaaaaaaaaaaaaaa",data);
    this.an302 = JSON.parse(data);
      
    //  return(alarmTime)
    })

    this.socket.on('AN-103A',(data)=>{
      console.log(data);
      this.an103a = JSON.parse(data);
        
      //  return(alarmTime)
      })

      this.socket.on('AN-301',(data)=>{
        console.log(data);
        this.an301 = JSON.parse(data);
          
        //  return(alarmTime)
        })

      this.socket.on('AN-305A',(data)=>{
        console.log(data);
        this.an305a = JSON.parse(data);
          
        //  return(alarmTime)
        })

        this.socket.on('AN-304C',(data)=>{
          console.log(data);
          this.an304c = JSON.parse(data);
            
          //  return(alarmTime)
          })

          this.socket.on('AN-303',(data)=>{
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",data);
            this.an303 = JSON.parse(data);
              
            //  return(alarmTime)
            })

            this.socket.on('LT-22222-L',(data)=>{
              console.log(data);
              this.lt22 = JSON.parse(data);
                
              //  return(alarmTime)
              })
  }

  ngOnInit(){
    console.log("Trying to send establish a socket connexion within the server")
    this.ChartUpdate.on('setChartdata', (dataa) => {
      console.log('setchardata' , dataa);
     this.ChartUpdateSource.next(dataa);
   
   });

  }
  private filter = new BehaviorSubject<any>({value: 'nan'});
  currentRelayMessage = this.filter.asObservable();

  Data(id) {
    this.filter.next(id);
  }

  private stat = new BehaviorSubject<any>({value: 'nan'});
  dataMsg = this.stat.asObservable();

  private factO = new BehaviorSubject<any>({value: 'nan'});
  private smoke = new BehaviorSubject<any>({value: 'nan'});
  FactureData = this.factO.asObservable();
  smokeMsg = this.smoke.asObservable();

  DataStat(item) {
    this.stat.next(item);

    console.log("item received: " + item)
  }
  smokeStat(item){
this.smoke.next(item)
  }
  FactureStat(item){
    this.factO.next(item);
  }
  ChartUpdatefunction(token , locationId) {
     console.log('updated Chart');
    if (this.updateChartRequired) {
      this.ChartUpdate.emit('getChartdata', {Accesstoken: token, LocationId: locationId});
      this.updateChartRequired = false;
      // this.ChartUpdate.disconnect();
      // console.log('updated Chart');
    }
  }
  SmokeConnexion() {
    // console.log('updated Chart');
   
    this.socket.emit('getDoc', "3")
      this.updateChartRequired = false;
      // this.ChartUpdate.disconnect();
      // console.log('updated Chart');
    }
  

/*********** soket it */

  Update = io.connect('http://localhost:3007/hello');

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }
  getDocument(id: string) {
    console.log("trying to send data to server with webSoket")
    this.socket.emit('getDoc', id)

    this.documents.subscribe(data=>{console.log("document: "+data)});
  }
 
}
