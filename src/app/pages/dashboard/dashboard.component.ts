import { Component, OnDestroy } from "@angular/core";
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbSearchService,
  NbThemeService,
  NbToastrService
} from "@nebular/theme";
import { takeWhile } from "rxjs/operators";
import { SolarData } from "../../@core/data/solar";
import { HttpClient, HttpParams } from "@angular/common/http";
import { DashService } from "./dash.service";
import { ToasterConfig } from "angular2-toaster";
import { WebsocketSoService } from "./websocket-so.service";

import { from, Observable } from "rxjs";
import { TriphaseComponent } from "./triphase/triphase.component";
//import { TranslateService } from "@ngx-translate/core";
interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

const Swal = require("sweetalert2");

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnDestroy {
  private alive = true;
  private test1;
  smoke: any = "x";
  smokeAlarm = "ok";
  triphasefactId = "";

  private Sdata = [];
 private factoryData = []
    private token;
  private devices;
  options = [];
  options2 = [];
  places: {};
  selectedFactory: any = "ok";
  selectedZone: any = "ok";
  selectedDevice: any = "ok";
  findFactoryByuser = "/api/Factories/factory/ByUser";
  selectedOption: any = "ok";

  select: any;
  solarValue: number;
  lightCard: CardSettings = {
    title: "Light",
    iconClass: "nb-lightbulb",
    type: "primary"
  };
  // selectedDevice: any;
  statusCards: string;
  private data: any;
  private data2: any;
  private data3: any;


  // selectedOption;
  public id_fac: any;
  public Alertdata: any;
 
  an103a : any 
  an302 : any 
  an301 : any 
  an303 : any 
  an304c : any  
  an305a : any 
  lt22 : any 
  option : any

  //findFactoryByuser = "/api/Factories/factory/ByUser";
  // findAllDevices = "/api/sensors/sensor/findByUser";
  // options = [];
  // devices = [];

  //test = factories names
  /*test = this.http
    .post(this.findFactoryByuser, {}, this.option)
    .subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.options = resJSON;
      for (let o in this.options) {
        console.log("option name " + o);
      }
    });

  getDevices = this.http
    .post(this.findAllDevices, {}, this.option)
    .subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.devices = resJSON;
      for (let i = 0; i < 4; i++) {
        console.log("devices name " + i + this.devices[i].name);
      }
    });

  state: boolean;
  /*
  ok(event) {
    this.http
      .post("/api/sensors/sensor/findByCode", { code: event }, this.option)
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data2 = resJSON;
        this.http
          .post(
            "/api/sensors/sensor/actuator/",
            {
              state: !this.data2[0].state,
              code: event
            },
            this.option
          )
          .subscribe(data1 => {
            console.log("data1: " + data1);
          });
        if (this.data2[0].state) {
          Swal.fire("OFF!", "Your light device is OFF now.", "error");
        } else Swal.fire("ON!", "Your light device is ON now.", "success");
      });
  }*/
  filteredOptions: any;
  filteredDEvices: any;
  /*filter() {
    console.log("filter function is called");
    console.log("selected factory: " + this.selectedOption._id);
    if (!this.selectedOption._id) {
      return (this.filteredOptions = this.options);
    }
    this.filteredOptions = this.options.filter(
      it => this.selectedOption._id === it._id
    );

    this.service.Data(this.selectedOption._id);
    // this.getData();
  }

  filter2() {
    console.log("filter2 function is called");
    this.service.Data({ value: "nan" });
  }

  filterDevices() {
    console.log("selected factory: " + this.selectedDevice._id);
    if (!this.selectedDevice._id) {
      return (this.filteredOptions = this.options);
    }
    this.filteredDEvices = this.options.filter(
      it => this.selectedDevice._id === it._id
    );
    this.service.Data(this.selectedDevice._id);
  }*/

  commonStatusCardsSet: CardSettings[] = [this.lightCard];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: "warning"
      }
    ],
    dark: this.commonStatusCardsSet
  };
  documents: Observable<string[]>;
  email;
  result: any;
  resulttroiscentun: any;
  resulttroiscentquatre: any;
  troiscentcinq: any;
  dvs: Object;
  fd: ArrayBuffer;
  allDevise: any;
  allDevisetwo:any
  constructor(
    //private Triphase: TriphaseComponent,
    // private translate: TranslateService,
    private themeService: NbThemeService,
    private solarService: SolarData,
    private searchService: NbSearchService,
    private http: HttpClient,
    private service: DashService,
    private toastrService: NbToastrService,
    private serviceSock: WebsocketSoService
  ) {

    this.option = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };

    const option = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
    .post(
      "/api/sensors/sensor/all/all",
      {
        type: "Sensor",
      },
      option
    )
    .subscribe(data => {
      console.log('jj', data)
      this.allDevise = data
      this.allDevisetwo = this.allDevise
    });

    this.http.post('/api/sensors/sensor/findByType',
      {
        type: 'AN-302',
      }, this.option).subscribe(data2 => {
      const resSTR = JSON.stringify(data2);
      const resJSON = JSON.parse(resSTR);
      this.result = resJSON;
      console.log('troiscentdeux' , this.result)
      this.an302 = this.result;
      this.an302 = this.an302[0].data
      console.log('a',this.an302)


    });

    this.http.post('/api/sensors/sensor/findByType',
    {
      type: 'AN-301',
    }, this.option).subscribe(data2 => {
      const resSTR = JSON.stringify(data2);
      const resJSON = JSON.parse(resSTR);
      this.resulttroiscentun = resJSON;
      console.log('troiscenun' , this.resulttroiscentun)
      this.an301 = this.resulttroiscentun;
      this.an301 = this.an301[0].data
      console.log('z',this.an301[0])
      //3892
    });


    this.http.post('/api/sensors/sensor/findByType',
    {
      type: 'AN-304C',
    }, this.option).subscribe(data2 => {
      const resSTR = JSON.stringify(data2);
      const resJSON = JSON.parse(resSTR);
      this.resulttroiscentquatre = resJSON;
      console.log('troiscentquatre' , this.resulttroiscentquatre)
      
      this.an304c = this.resulttroiscentquatre;
      this.an304c = this.an304c[0].data
      //3892
    });

    this.http.post('/api/sensors/sensor/findByType',
    {
      type: 'AN-305A',
    }, this.option).subscribe(data2 => {
      const resSTR = JSON.stringify(data2);
      const resJSON = JSON.parse(resSTR);
      this.troiscentcinq = resJSON;
      console.log('troiscentcinq' , this.troiscentcinq)
      
      this.an305a= this.troiscentcinq;
      this.an305a = this.an305a[0].data
      //an305a[an305a.length-1].essemLattribut==0 ou 1


      console.log('c',this.an305a)
      
      //3892
    });
    
    this.an103a = this.service.an103a;
    this.an303 = this.service.an303;
    this.lt22 = this.service.lt22;

    //translate.setDefaultLang('en');
    this.token = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/sensors/sensor/findByType",
        {
          type: "Sensor"
        },
        this.token
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.Sdata = resJSON;
        console.log('-----------------', this.Sdata)
      });
    //findFactoryByUser
    this.http.post(this.findFactoryByuser, {}, this.token).subscribe(data => {
      console.log('ooooooooooooooooo',data)
      this.fd = data
      console.log("llllllllllllllll",this.fd)
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.factoryData = resJSON;
      console.log("factoryData: " + this.factoryData);
    });
    //selectZoneByFactory

    //this.triphasefactId = Triphase.triphaseId;

    this.http
      .post("/api/sensors/findAlert", {}, this.option)
      .subscribe(data2 => {
        const resSTR = JSON.stringify(data2);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON;

        console.log("alert sent: " + this.data);
      });

    console.log("socket connection");
    this.email = localStorage.getItem("Useremail");
    console.log("UserEmail: " + this.email);

    this.serviceSock = serviceSock;
    console.log('11111' , this.serviceSock)

    /*
    this.service.currentRelayMessage.subscribe(data => {
      if (data.value === "nan") {
        this.getData();
        console.log("nan !!");
      } else {
        this.id_fac = data;
        console.log("id_fac: " + this.id_fac);
        const option = {
          params: new HttpParams().append(
            "token",
            localStorage.getItem("token")
          )
        };
        this.http
          .post(
            "/api/sensors/sensor/findByType",
            {
              type: "lightActuator",
              factoryId: this.id_fac
            },
            option
          )
          .subscribe(data => {
            const resSTR = JSON.stringify(data);
            const resJSON = JSON.parse(resSTR);
            this.data = resJSON;
            for (var d in data) {
              console.log("data " + d);
            }
          });
        this.getSensor();
      }
    }); */

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

    this.solarService
      .getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.solarValue = data;
      });
    this.getSensor();
    console.log('22222',this.getSensor())
  }


  testDevice(name : any){
    var test = false
    for(var i = 0 ; i<this.allDevise.length ; i++){
      if(String(this.allDevise[i].type) == name){
        test = true
      }
    }
    return test
  }

  selectZone() {
    this.allDevise = this.allDevisetwo
    console.log('1' , this.allDevise)
    console.log('---' , this.selectedFactory)
    this.allDevise = this.allDevise.filter((i:any)=>{
      return i.factoryId == this.selectedFactory._id
    })

    console.log('1111' , this.allDevise)

    

    //--------------------------
    this.http
      .post(
        "/api/Factories/factory/placeByFactory",
        { id: this.selectedFactory },
        this.token
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.options2 = resJSON;
        console.log("selectedFactory: " + this.selectedFactory);
        this.places = this.options2[0].place;
        console.log("places: " + this.places);
        // console.log(' click place'  , this.options2[0].place);
      });
  }

    //zone
  selectDevice() {
    console.log('---ZONE---',this.selectedZone)
    this.http
      .post(
        "/api/sensors/sensor/byArea",
        { area: this.selectedZone },
        this.token
      )
      .subscribe(data => {
        console.log('--DATA-ZONE---' , data)
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.devices = resJSON;

        this.allDevise = this.allDevise.filter((i:any)=>{
          return i.area == this.selectedZone
        })
        console.log('2222' , this.allDevise)

        //this.service.DataStat(this.selectedDevice);

        console.log("device by zone: " + this.devices[0].name);

        // console.log(' click place'  , this.options2[0].place);
      });
  }

  send() {
    this.allDevise = this.allDevisetwo

    console.log(
      "testtttttttttttttttttttttttttttttttttttt: " + this.selectedDevice
    );
    this.allDevise = this.allDevise.filter((i:any)=>{
      return i.type == this.selectedDevice
    })
  }

  getSensorByFac(event:any){
    console.log(event)
    // const option = {
    //   params: new HttpParams().append("token", localStorage.getItem("token"))
    // };

    // this.http
    //   .post(
    //     "/api/sensors/sensor/findByType",
    //     {
    //       type: "Sensor",
    //       factoryId: this.id_fac
    //     },
    //     option
    //   )
    //   .subscribe(data => {
    //     this.dvs = data
    //   });
  }

  getSensor() {
    const option = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/sensors/sensor/findByType",
        {
          type: "Sensor",
          factoryId: this.id_fac
        },
        option
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data3 = resJSON;
        this.data3.forEach(item => {
          this.NotifToast(item);
        });
      });
  }

  NotifToast(item) {
    const option = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/alerts/alert/ToastNotification",
        {
          code: item._id
        },
        option
      )
      .subscribe(data2 => {
        const resSTR = JSON.stringify(data2);
        const resJSON = JSON.parse(resSTR);
        this.Alertdata = resJSON;
        const i = item.data.length - 1;
        this.Alertdata.forEach(alert => {
          //  console.log(+ item.data[i].tempValues + '<' + alert.min + '||' + item.data[i].tempValues + '>' + alert.max);
          if (alert.data === "Temperature") {
            if (
              item.data[i].tempValues < alert.min ||
              item.data[i].tempValues > alert.max
            ) {
              this.content =
                "temperature of  :  " +
                item.name +
                " is : " +
                item.data[i].tempValues;
              this.status = alert.status;
              this.title = alert.status;
              const HV = item.data[i].tempValues;
              const HN = item.name;
              this.duration = 10000;
              const dataa = "Humidity";
              // this.sendEmail(item, alert , HV , HN , dataa , this.status) ;
              this.makeToast();
            }
          }
          if (alert.data === "Humidity") {
            if (
              item.data[i].humValues < alert.min ||
              item.data[i].humValues > alert.max
            ) {
              this.content =
                "Humidity of  :  " +
                item.name +
                " is : " +
                item.data[i].humValues;
              const HV = item.data[i].humValues;
              const HN = item.name;
              this.status = alert.status;
              this.duration = 10000;
              this.title = alert.status;
              const dataa = "Humidity";
              this.makeToast();
              //  this.sendEmail(item, alert , HV , HN , dataa , this.status) ;
            }
          }
        });
      });
  }

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }
  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 6000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "danger";
  title = " Alert !!";
  content = "";
  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: true,
      position: this.position,
      preventDuplicates: this.preventDuplicates
    };
    const titleContent = title;
    this.index += 1;
    this.toastrService.show(body, `${titleContent}`, config);
  }
  getData() {
    const option = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/sensors/sensor/findByType",
        {
          type: "lightActuator"
        },
        option
      )
      .subscribe(data => {
        const resSTR = JSON.stringify(data);
        const resJSON = JSON.parse(resSTR);
        this.data = resJSON;
        console.log("ouroooo" + data);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  smokeService() {
    var x = "1";

    this.service.documents.subscribe(data => {
      console.log("documents: " + data);
    });
  }
  ngOnInit() {
    var x = "1";
    // this.service.getDocument(x);

    this.service.documents.subscribe(data => {
      console.log("documents: " + data);
    });
    this.service.smokeMsg.subscribe(data => {
      console.log(" this.smoke.state: " + this.smoke.state);
      this.smoke = data;
      if (this.smoke != "x" && this.smoke.state == "1") {
        this.smokeAlarm = "nok";
        console.log("smokeAlarm: " + this.smokeAlarm);

        var code = this.smoke.code;
        var email = { Nemail: this.email };
        this.sendEmail(
          code,
          email,
          "",
          "Smoke  has detcted incident at ",
          this.smoke.time,
          ""
        );
      }

      console.log("smokeState: " + this.smoke.state);
      console.log("smokeSentAt: " + this.smoke.time);
      console.log("smokeFactoryAt: " + this.smoke.factory);
      console.log("smokeAreaAt: " + this.smoke.area);

      console.log("datareveied from dashs: " + this.smoke);
    });
  }
  sendEmail(item, alert, value, name, data, status) {
    const option = {
      params: new HttpParams().append("token", localStorage.getItem("token"))
    };
    this.http
      .post(
        "/api/alerts/alert/SendEmail",
        {
          device: item.code,
          Nemail: alert.Nemail,
          value: value,
          name: name,
          data: data,
          status: status
        },
        option
      )
      .subscribe(data2 => {
        const resSTR = JSON.stringify(data2);
        const resJSON = JSON.parse(resSTR);
        this.data3 = resJSON;
      });
  }
}
