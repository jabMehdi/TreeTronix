import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'ngx-echarts-line',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsLineComponent {
  options: any = {};
  themeSubscription: any;
  tab1 = [];
  tab2 = [];
  tab3 = [];
  data;

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
        // equation ta3  Prod1-prod0
        let i;
        for (i = 0; i < 48; i++) {
          this.tab2.push(item.Countersdata[i].PositiveActiveTotalEnergy);
          const date = new Date(item.Countersdata[i].time);
          let min;
          date.getMinutes() > 10 ? (min = date.getMinutes()) : min = '0' + date.getMinutes();
          this.tab1.push(date.getFullYear() + '/' + date.getDate() +
            '/' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + min + ' ');
        }
      });
      this.chart(this.tab1, this.tab2, this.tab3);
    });
  }


  chart(tab1, tab2, tab3) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}',
        },
        legend: {
          left: 'left',
          data: ['Consumption', 'Production'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: tab1,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'log',
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
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: [
          {
            name: 'Consumption',
            type: 'line',
            data: tab2,
          },
          {
            name: 'Production',
            type: 'line',
            data: [9, 11, 12, 70, 3, 39],
          },
        ],
      };
    });
  }
}
