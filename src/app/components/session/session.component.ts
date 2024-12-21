import { Component, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexGrid,
  ApexXAxis,
} from 'ng-apexcharts';
import {
  AnalyticsCategoryVars,
  AnalyticsCommandVars,
} from 'src/app/constants/analytics';
import { ToastEvent } from 'src/app/constants/toast';
import { EventData } from 'src/app/models/analyticsget';
import { AnalyticsApiService } from 'src/app/services/analytics/analytics-api.service';
import { DynamicformService } from 'src/app/services/dynamicform/dynamicform.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ToastService } from 'src/app/services/toast/toast.service';

export interface GaugeChartOptions {
  chart: ApexChart;
  series: number[];
  colors: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  labels: string[];
  annotations?: ApexAnnotations;
}

export interface LineChartOptions {
  chartSeries: ApexAxisChartSeries;
  chartOptions: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
}

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
  averageSessionDuration!: EventData;
  sessionPerTimePeriod!: EventData;
  public lineChartOptions!: LineChartOptions;
  public gaugeChartOptions!: GaugeChartOptions;
  showGaugeChart = false;
  isShowLineChart = false;

  constructor(
    private analyticsService: AnalyticsApiService,
    private loggingService: LoggingService,
    private toastService: ToastService,
    private dynamicFormService: DynamicformService
  ) {}

  ngOnInit(): void {
    this.analyticsService
      .getMetadataByCategoryName(AnalyticsCategoryVars.SESSION)
      .subscribe({
        next: (value) => {
          this.handleInputRequirements(value.data || []);
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  handleInputRequirements(data: EventData[]) {
    this.averageSessionDuration = data.find(
      (event) => event.name === 'SESSIONS_PER_USER'
    )!;
    this.sessionPerTimePeriod = data.find(
      (event) => event.name === 'SESSIONS_PER_TIME_PERIOD'
    )!;

    this.dynamicFormService.setInputRequirements(
      this.averageSessionDuration.inputRequirements || []
    );

    this.dynamicFormService.setInputRequirements(
      this.sessionPerTimePeriod.inputRequirements || []
    );
  }

  createGaugeChart(data: any) {
    this.gaugeChartOptions = {
      chart: {
        height: 280,
        type: 'radialBar',
      },
      series: [data],
      colors: ['#20E647'],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '70%',
            background: '#293450',
          },
          track: {
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: '#fff',
              fontSize: '13px',
            },
            value: {
              color: '#fff',
              fontSize: '30px',
              show: true,
              formatter: function (value) {
                return value.toFixed(2);
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          gradientToColors: ['#87D4F9'],
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round',
      },
      labels: ['Avg Session Duration'],
    };
  }

  averageSessionFormSubmit(data: any): void {
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.SESSIONS_PER_USER,
        requiresInput: true,
        inputRequirements: [
          {
            key: 'userId',
            value: data.userId,
            dataType: 'Text',
            displayValue: 'User ID',
          },
        ],
      })
      .subscribe({
        next: (response) => {
          const sessionsPerUser = response.data?.data['sessionsPerUser'];
          if (
            typeof sessionsPerUser === 'string' ||
            sessionsPerUser instanceof String
          ) {
            this.toastService.show(
              this.toastService.createToast(
                response.data?.data['sessionsPerUser'].toString(),
                ToastEvent.Secondary
              )
            );
          } else {
            this.createGaugeChart(sessionsPerUser);
            this.showGaugeChart = true;
          }
        },
        error: (error) => {
          this.loggingService.error(error);
        },
      });
  }

  onSessionPerTimePeriodFormSubmit(data: any): void {
    this.loggingService.log(data);
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.SESSIONS_PER_TIME_PERIOD,
        requiresInput: true,
        inputRequirements: [
          {
            key: 'startDate',
            displayValue: 'Start Date',
            dataType: 'Date',
            value: this.convertToDDMMYYYY(data.startDate),
          },
          {
            key: 'endDate',
            displayValue: 'End Date',
            dataType: 'Date',
            value: this.convertToDDMMYYYY(data.endDate),
          },
        ],
      })
      .subscribe((response) => {
        const sessionsPerTimePeriod =
          response.data?.data['sessionsPerTimePeriod'];
        this.loggingService.log(sessionsPerTimePeriod);
        if (Array.isArray(sessionsPerTimePeriod)) {
          this.createLineChart(sessionsPerTimePeriod);
        } else if (
          typeof sessionsPerTimePeriod === 'string' ||
          sessionsPerTimePeriod instanceof String
        ) {
          this.toastService.show(
            this.toastService.createToast(
              response.data?.data['sessionsPerTimePeriod'].toString(),
              ToastEvent.Secondary
            )
          );
        } else {
          this.toastService.show(
            this.toastService.createToast(
              'Some Error Occurred!',
              ToastEvent.Danger
            )
          );
        }
      });
  }

  createLineChart(apiData: any) {
    const activeUsers = apiData || [];
    const categories = activeUsers.map((user: any) => user.date);
    const data = activeUsers.map((user: any) => user.sessionCount);

    this.lineChartOptions = {
      chartSeries: [
        {
          name: 'Sessions per time period',
          data: data,
        },
      ],
      chartOptions: {
        type: 'line',
        height: 350,
      },
      xaxis: {
        categories: categories,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    };
    this.isShowLineChart = true;
  }
  convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
