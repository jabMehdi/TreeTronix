import {Component, AfterViewInit, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'ngx-echarts-multiple-xaxis',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsMultipleXaxisComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  ComTable = [2, 6];
  tableDate = ['20/16'];
  prodTable = [7, 0.5];
  data ;

  constructor(private theme: NbThemeService, private http: HttpClient) {
    const optionss = {
      params: new HttpParams().append('token', localStorage.getItem('token')),
    };
    this.http.post('http://localhost:3000/api/sensors/sensor/findByType',
      {
        type: 'mono',
      }, optionss).subscribe(data => {
      const resSTR = JSON.stringify(data);
      const resJSON = JSON.parse(resSTR);
      this.data = resJSON;
      this.data.forEach(item => {
        // equation ta3 nami Prod1-prod0
        const c = item.Countersdata.length - 1;
        this.prodTable.push(item.Countersdata[c].PositiveActiveTotalEnergy);
        console.log('wlh' , item) ;
        console.log('prodTable' , this.prodTable) ;

      });
    } ) ;

  }

    ngAfterViewInit() {
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        this.options = {
          backgroundColor: echarts.bg,
          color: [colors.success, colors.info],
          tooltip: {
            trigger: 'none',
            axisPointer: {
              type: 'cross',
            },
          },
          legend: {
            data: [' consumption chart ', 'production chart'],
            textStyle: {
              color: echarts.textColor,
            },
          },
          grid: {
            top: 70,
            bottom: 50,
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors.info,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
              axisPointer: {
                label: {
                  formatter: params => {
                    return (
                      'consumption  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    );
                  },
                },
              },
              data: this.tableDate,
            },
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: colors.success,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
              axisPointer: {
                label: {
                  formatter: params => {
                    return (
                      'production  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                    );
                  },
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
              splitLine: {
                lineStyle: {
                  color: echarts.splitLineColor,
                },
              },
              axisLabel: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
          ],
          series: [
            {
              name: 'Consumption',
              type: 'line',
              xAxisIndex: 1,
              smooth: true,
              data: this.ComTable,
            },
            {
              name: 'Production',
              type: 'line',
              smooth: true,
              data: this.prodTable,
            },
          ],
        };
      });
    }

    ngOnDestroy()
  :
    void {
      this.themeSubscription.unsubscribe();
  }
  }
