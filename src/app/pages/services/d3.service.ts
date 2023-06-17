import { Injectable,ElementRef  } from '@angular/core';
import * as d3 from 'd3';
import { CombColor} from '../../model/CombColor';
import { formatDate, DatePipe } from '@angular/common';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class D3Service {
  // tslint:disable-next-line: variable-name
  Time_Axis_Group: any;
  // tslint:disable-next-line: variable-name
  Y_Axis_Group: any;
  SVG: any;
  containerHeight: number;
  containerWidth: number;
  DatesScale: any;
  Yscale: any;
  TimeAxis: any;
  YAxis: any;
  path: any;
  dots: any;

  ValueTracker: d3.Selection<any, any, any, any>;

  pipe = new DatePipe('en-US'); // Use your own locale

  constructor() { }

  trackValue(d: any, format: string, color: string) {
    d3.select('#trackTime').style('color', color).text(this.pipe.transform(d.date, format));
    d3.select('#trackHour').style('color', color).text(this.pipe.transform(d.date, 'shortTime'));
    d3.select('#trackValue').style('color', color).text(d.y);

  }

  InitSVG(chartareaID: string, cardContainer: ElementRef) {
    this.SVG = d3.select('#' + chartareaID).append('svg').attr('id', chartareaID + '_SVG')
    .attr('width', cardContainer.nativeElement.offsetWidth)
    .attr('height', cardContainer.nativeElement.offsetHeight);

    this.containerHeight = cardContainer.nativeElement.offsetHeight;
    this.containerWidth = cardContainer.nativeElement.offsetWidth;

  }

  ResizeSVG(chartareaID: string, cardContainer: ElementRef) {
    this.SVG = d3.select('#' + chartareaID + '_SVG')
    .attr('width', cardContainer.nativeElement.offsetWidth)
    .attr('height', cardContainer.nativeElement.offsetHeight);

    this.containerHeight = cardContainer.nativeElement.offsetHeight;
    this.containerWidth = cardContainer.nativeElement.offsetWidth;
  }

  InitAxesEmpty() {
    this.InitAxes(new Date(), new Date(), 0, 1);
  }

  InitAxes(FirstDate: Date, LastDate: Date, ymin: number , Ymax: number) {

    this.DatesScale = d3.scaleTime().domain([FirstDate, LastDate]).range([0, this.containerWidth * 0.75]);
    this.Yscale = d3.scaleLinear().domain([Ymax , ymin]).range([0, this.containerHeight * 0.8]);

    const TimeAxis = d3.axisBottom(this.DatesScale);
    const YAxis = d3.axisLeft(this.Yscale).ticks(5);

    this.Time_Axis_Group = this.SVG.append('g')
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',' + ((this.containerHeight * 0.8 ) + 10)   + ')')
    .attr('stroke', 'gray').call(TimeAxis);

    this.Y_Axis_Group = this.SVG.append('g')
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ', 10 )')
    .attr('stroke', 'gray').call(YAxis);
  }

  ResizeAxes(DatesArray: Array<Date>, ymin: number , Ymax: number) {

    const t = d3.transition().duration(1200);
    const minD = Math.min.apply(Math, DatesArray);
    const MAXD = Math.max.apply(Math, DatesArray);
    this.DatesScale = d3.scaleTime().domain([minD, MAXD]).range([0, this.containerWidth * 0.75]);

    this.Yscale = d3.scaleLinear().domain([Ymax, ymin]).range([0, this.containerHeight * 0.8]);

    const TimeAxis = d3.axisBottom(this.DatesScale);
    const YAxis = d3.axisLeft(this.Yscale).ticks(5);

    this.Time_Axis_Group
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',' + ((this.containerHeight * 0.8 ) + 10)   + ')')
    .transition(t)
    .call(TimeAxis);
    this.Y_Axis_Group.attr('transform', 'translate(' + (this.containerWidth * 0.1) + ', 10 )').transition(t).call(YAxis);
  }

  InitCurveEmpty(color: CombColor) {
    this.InitCurve([], color);
  }

  InitCurve(dataArray: Array<any>, color: CombColor) {

    this.path = this.SVG.append('path')
    .datum(dataArray)
    .attr('fill', 'none')
    .attr('stroke', color.primary)
    .attr('stroke-width', 1.5).attr('fill', 'url(#areachart-gradient)' )
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('d', d3.line()
      .x((d: any, i) => this.DatesScale(d.date))
      .y((d: any, i) => this.Yscale(d.y))
      );

    this.dots = this.SVG.selectAll('.dot')
    .data(dataArray)
    .enter().append('circle') // Uses the enter().append() method
    .attr('class', 'dot') // Assign a class for styling
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('cx', (d: any, i) => this.DatesScale(d.date))
    .attr('cy', (d: any, i) => this.Yscale(d.y))
    .attr('stroke', color.primary)
    .attr('fill', color.secondary)
    .attr('r', 2.5).on('mouseover', (d: any) => {
      this.trackValue(d, 'mediumDate', color.primary);
      d3.select(d3.event.target)
      .transition().duration(100)
      .attr('r', 7.5);
    }).on('mouseout', (d: any) => {
      d3.select(d3.event.target)
      .transition().duration(100)
      .attr('r', 2.5);
  });


  }

  SwitchAxis(Ymax: number) {
    const t = d3.transition().duration(1200);
    this.Yscale = d3.scaleLinear().domain([Ymax, 0]).range([0, this.containerHeight * 0.8]);
    const YAxis = d3.axisLeft(this.Yscale).ticks(5);
    this.Y_Axis_Group.transition(t).call(YAxis);
  }

  SwitchCurve(dataArray: Array<any>, color: CombColor) {
    // console.log(dataArray);
    this.path
    .datum(dataArray).transition()
    .duration(1000)
    .attr('stroke', color.primary)
    .attr('d', d3.line()
    .x((d: any, i) => this.DatesScale(d.date))
    .y((d: any, i) => this.Yscale(d.y))

    );

    this.dots.remove();

    this.dots = this.SVG.selectAll('.dot')
        .data(dataArray)
        .enter().append('circle')// Uses the enter().append() method
        .attr('class', 'dot') // Assign a class for styling
        .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
        .attr('cx', (d: any, i) => this.DatesScale(d.date))
        .attr('cy', (d: any, i) => this.Yscale(d.y))
        .attr('stroke', color.primary)
        .attr('fill',color.secondary)
        .attr('r', 2.5).on('mouseover', (d: any) => {
          this.trackValue(d, 'mediumDate', color.primary);
          d3.select(d3.event.target)
          .transition().duration(100)
          .attr('r', 7.5);
        }).on('mouseout', (d: any) => {
          d3.select(d3.event.target)
          .transition().duration(100)
          .attr('r', 2.5);
      });



  }

  ResizeCurve2(dataArray: Array<any>, e: number, h: number) {
    const colorStroke = this.path.attr('stroke');
    const colorFill = this.dots.attr('fill');
    this.path.remove();

    this.path = this.SVG.append('path')
    .datum(dataArray.slice(e, h))
    .attr('fill', 'none')
    .attr('stroke', colorStroke)
    .attr('stroke-width', 1.5)
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('d', d3.line()
      .x((d: any, i) => this.DatesScale(d.date))
      .y((d: any, i) => this.Yscale(d.y))
    );

    this.dots.remove();

    this.dots = this.SVG.selectAll('.dot')
    .data(dataArray.slice(e, h))
    .enter().append('circle') // Uses the enter().append() method
    .attr('class', 'dot') // Assign a class for styling
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('cx', (d: any, i) => this.DatesScale(d.date))
    .attr('cy', (d: any, i) => this.Yscale(d.y))
    .attr('stroke', colorStroke)
    .attr('fill', colorFill)
    .attr('r', 2.5).on('mouseover', (d: any) => {
      this.trackValue(d, 'mediumDate', this.dots.attr('stroke'));
      d3.select(d3.event.target)
      .transition().duration(100)
      .attr('r', 7.5);
    }).on('mouseout', (d: any) => {
      d3.select(d3.event.target)
      .transition().duration(100)
      .attr('r', 2.5);
  });
  }

  ResizeCurve() {

    this.path.attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('d', d3.line()
      .x((d: any, i) => this.DatesScale(d.date))
      .y((d: any, i) => this.Yscale(d.y))
      );

    this.SVG.selectAll('.dot')
    .attr('class', 'dot') // Assign a class for styling
    .attr('transform', 'translate(' + (this.containerWidth * 0.1) + ',10)')
    .attr('cx', (d: any, i) => this.DatesScale(d.date))
    .attr('cy', (d: any, i) => this.Yscale(d.y));

  }



}



