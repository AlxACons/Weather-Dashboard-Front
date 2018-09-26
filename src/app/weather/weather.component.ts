import { Component, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { WeatherService } from '../weather.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-root',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit,AfterViewInit {

  @ViewChild('canvas') canvas : ElementRef;
  public context: CanvasRenderingContext2D;

  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;
  columnNames = [
    {
      id: "date",
      value: "Date"

    }, {
      id: "min",
      value: "Min. Temperature"
    }, {
      id: "max",
      value: "Max. Temperature"
    }
  ];
  chart = [];
  chartC : Chart;

  city: string = "1";
  tempType: string = "1";

  todayDate: Date = new Date();//can not be today
  maxDatePicker: Date = new Date();
  selectDateStart: Date = new Date();
  selectDateEnd: Date = new Date();

  constructor(private _weather : WeatherService) {
    
    this.todayDate.setDate(this.todayDate.getDate() + 1);
    this.todayDate.setHours(0,0,0,0);

    this.selectDateStart = this.todayDate;
    this.selectDateEnd = this.todayDate;

    this.maxDatePicker.setDate(this.maxDatePicker.getDate() + 16);
    this.maxDatePicker.setHours(0,0,0,0);

  }


  ngOnInit() {

    this.displayedColumns = this.columnNames.map(x => x.id);

    this.getTemperature();

  }

  ngAfterViewInit(){
 
  }

  getTemperature(){
    
    
    if(typeof this.selectDateStart == "undefined" || this.selectDateStart == null || this.selectDateStart < this.todayDate || this.selectDateStart > this.selectDateEnd)
      this.selectDateStart = this.todayDate;
    if(typeof this.selectDateEnd == "undefined" || this.selectDateEnd == null || this.selectDateEnd < this.todayDate || this.selectDateEnd < this.selectDateStart)
      this.selectDateEnd = this.todayDate; 

    if(typeof this.city != "undefined" && typeof this.tempType != "undefined"){
      this.generateGraph();
    }


  }

  generateGraph(){


    this._weather.getForeCast(this.city, this.tempType, Math.round(this.selectDateStart.getTime() / 1000),Math.round(this.selectDateEnd.getTime() / 1000))
    .subscribe(res => {
      
      let table_data = {};
      let min_temp = [];
      let max_temp = [];

      let weatherDates = [];
      for (let key in res){
        let Tsdate = new Date(res[key].Ts * 1000)

        if(typeof res[key].Max_temp != "undefined" && typeof res[key].Min_temp != "undefined"){
          //same row
          let date_format = Tsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' });
          weatherDates.push(date_format);
          min_temp.push(res[key].Max_temp);
          max_temp.push(res[key].Min_temp);
          table_data[date_format] = {};
          table_data[date_format]["min_temp"] = res[key].Min_temp;
          table_data[date_format]["max_temp"] = res[key].Max_temp;
          //
        }

      }

      this.createTable(table_data);

      let datasets = [
        { 
          data: max_temp,
          borderColor: "#3cba9f",
          fill: false
        },
        { 
          data: min_temp,
          borderColor: "#ffcc00",
          fill: false
        },
      ];
     
      if(this.chart.length == 0){
        
        this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
        this.chartC = new Chart(this.context, {
          type: 'line',
          data: {
            labels: weatherDates,
            datasets: datasets
          },
          options: {
            legend: {
              display: false
            }
          }
        });
        
      } else {
        this.chartC.data = {datasets: datasets, labels: weatherDates};
        this.chartC.options = {legend: { display: false } };
        this.chartC.update();
      }
      this.chart = this.chartC;


    }, error => {


      if(this.chart.length == 0){
        
        this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
        this.chartC = new Chart(this.context, {
          type: 'line',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            legend: {
              display: false
            }
          }
        });
        
      } else {
        this.chartC.data = {datasets: [], labels: []};
        this.chartC.options = {legend: { display: false } };
        this.chartC.update();
      }

    });

  }

  createTable(table_data) {
    let tableArr = [];
    for(var key in table_data){
      tableArr.push( {date : key,min: table_data[key].min_temp, max: table_data[key].max_temp }  );
    }
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }

}
