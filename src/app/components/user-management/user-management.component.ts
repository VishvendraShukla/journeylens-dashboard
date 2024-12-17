import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexStroke,
  ApexAnnotations,
  ApexFill,
  ApexDataLabels,
  ApexGrid,
} from 'ng-apexcharts';
import {
  AnalyticsCategoryVars,
  AnalyticsCommandVars,
} from 'src/app/constants/analytics';
import { ToastEvent } from 'src/app/constants/toast';
import { EventData, InputRequirement } from 'src/app/models/analyticsget';
import { AnalyticsApiService } from 'src/app/services/analytics/analytics-api.service';
import { DynamicformService } from 'src/app/services/dynamicform/dynamicform.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ToastService } from 'src/app/services/toast/toast.service';

export interface LineChartOptions {
  chartSeries: ApexAxisChartSeries;
  chartOptions: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
}
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

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public gaugeChartOptions!: GaugeChartOptions;
  public barChartOptions!: BarChartOptions;
  public lineChartOptions!: LineChartOptions;
  isShowBarChart = false;
  showGaugeChart = false;
  isShowLineChart = false;
  totalEventsEventData!: EventData;
  averageEventsPerUserEventData!: EventData;
  activeUsersEventData!: EventData;
  constructor(
    private analyticsService: AnalyticsApiService,
    private loggingService: LoggingService,
    private toastService: ToastService,
    private dynamicFormService: DynamicformService
  ) {}

  ngOnInit(): void {
    this.analyticsService
      .getMetadataByCategoryName(AnalyticsCategoryVars.USER_ENGAGEMENT)
      .subscribe({
        next: (value) => {
          this.handleInputRequirements(value.data || []);
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  handleInputRequirements(data: EventData[]) {
    this.totalEventsEventData = data.find(
      (event) => event.name === 'TOTAL_EVENTS_PER_USER'
    )!;
    this.averageEventsPerUserEventData = data.find(
      (event) => event.name === 'AVERAGE_EVENTS_PER_USER'
    )!;
    this.activeUsersEventData = data.find(
      (event) => event.name === 'ACTIVE_USERS'
    )!;
    this.dynamicFormService.setInputRequirements(
      this.activeUsersEventData.inputRequirements || []
    );
    this.dynamicFormService.setInputRequirements(
      this.totalEventsEventData.inputRequirements || []
    );
    this.getAverageData();
  }

  getAverageData() {
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.AVERAGE_EVENTS_PER_USER,
        requiresInput:
          this.averageEventsPerUserEventData?.requiresInput || false,
      })
      .subscribe({
        next: (response) => {
          this.createGaugeChart(response.data?.data['averageEventsPerUser']);
          this.showGaugeChart = true;
        },
        error: (error) => {
          this.loggingService.error(error);
        },
      });
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
      labels: ['Avg Events/User'],
    };
  }
  createBarChart(response: { eventType: string; eventCount: number }[]) {
    const categories = response.map((item) => item.eventType);
    const data = response.map((item) => item.eventCount);
    this.barChartOptions = {
      series: [
        {
          name: 'Event Count',
          data: data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      xaxis: {
        categories: categories,
      },
    };
    this.isShowBarChart = true;
  }
  createLineChart(apiData: any) {
    const activeUsers = apiData || [];
    const categories = activeUsers.map((user: any) => user.createdAt);
    const data = activeUsers.map((user: any) => user.count);

    this.lineChartOptions = {
      chartSeries: [
        {
          name: 'Active Users',
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

  onFormDataSubmit(data: any): void {
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.TOTAL_EVENTS_PER_USER,
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
      .subscribe((response) => {
        const totalEventsByUser = response.data?.data['totalEventsByUser'];
        this.loggingService.log(totalEventsByUser);
        if (Array.isArray(totalEventsByUser)) {
          this.createBarChart(totalEventsByUser);
        } else if (
          typeof totalEventsByUser === 'string' ||
          totalEventsByUser instanceof String
        ) {
          this.toastService.show(
            this.toastService.createToast(
              response.data?.data['totalEventsByUser'].toString(),
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

  onActiveUsersFormSubmit(data: any): void {
    this.loggingService.log(data);
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.ACTIVE_USERS,
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
        const activeUsers = response.data?.data['activeUsers'];
        this.loggingService.log(activeUsers);
        if (Array.isArray(activeUsers)) {
          this.createLineChart(activeUsers);
        } else if (
          typeof activeUsers === 'string' ||
          activeUsers instanceof String
        ) {
          this.toastService.show(
            this.toastService.createToast(
              response.data?.data['activeUsers'].toString(),
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

  convertToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
