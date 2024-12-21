import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexLegend,
  ChartComponent,
  ApexPlotOptions,
  ApexStates,
  ApexTooltip,
  ApexAxisChartSeries,
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

export interface EventQueryParams {
  userId: string;
  eventType: string;
  currentPage: number;
  pageSize: number;
}

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  states: ApexStates;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-eventtype',
  templateUrl: './eventtype.component.html',
  styleUrls: ['./eventtype.component.css'],
})
export class EventtypeComponent implements OnInit {
  queryParams: EventQueryParams = {
    userId: '',
    eventType: '',
    currentPage: 0,
    pageSize: 10,
  };
  @ViewChild('chart') chart: ChartComponent | undefined;
  public pieChartOptions!: PieChartOptions;
  public barChartOptions!: BarChartOptions;
  eventsByEventAndUserId!: EventData;
  isShowPieChart = false;
  isShowBarChart = false;
  isShowTable = false;
  events: any[] = [];
  totalPages: number = 0;
  sortDirection: { [key: string]: 'asc' | 'desc' } = {};
  currentSortColumn: string = '';
  userId!: string;
  eventType!: string;

  constructor(
    private analyticsService: AnalyticsApiService,
    private loggingService: LoggingService,
    private dynamicFormService: DynamicformService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.analyticsService
      .getMetadataByCategoryName(AnalyticsCategoryVars.EVENT_TYPE)
      .subscribe({
        next: (value) => {
          this.handleInputRequirements(value.data || []);
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  handleInputRequirements(data: EventData[]) {
    this.eventsByEventAndUserId = data.find(
      (event) => event.name === 'EVENTS_BY_EVENT_AND_USER'
    )!;
    this.dynamicFormService.setInputRequirements(
      this.eventsByEventAndUserId.inputRequirements || []
    );
    this.getEventTypeDistributionData();
    this.getMostCommonEventTypesData();
  }
  onFormDataSubmit(data: any): void {
    console.log(data);
    this.queryParams.userId = data.userId;
    this.queryParams.eventType = data.eventType;
    this.loadEventDataByUserId();
  }

  getMostCommonEventTypesData() {
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.COMMON_EVENT_TYPES,
        requiresInput: false,
      })
      .subscribe({
        next: (response) => {
          const commonEventTypes = response.data?.data['commonEventTypes'];
          if (Array.isArray(commonEventTypes)) {
            this.createBarChart(commonEventTypes);
          } else {
            this.toastService.show(
              this.toastService.createToast(
                'No data available.',
                ToastEvent.Secondary
              )
            );
          }
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  getEventTypeDistributionData() {
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.EVENT_TYPE_DISTRIBUTION,
        requiresInput: false,
      })
      .subscribe({
        next: (response) => {
          const distributionData = response.data?.data['eventTypeDistribution'];
          if (Array.isArray(distributionData)) {
            this.createPieChart(distributionData);
          } else {
            this.toastService.show(
              this.toastService.createToast(
                'No data available.',
                ToastEvent.Secondary
              )
            );
          }
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  createPieChart(response: { eventType: string; eventCount: number }[]) {
    const labels = response.map((item) => item.eventType);
    const data = response.map((item) => item.eventCount);

    this.pieChartOptions = {
      series: data,
      chart: {
        type: 'pie',
        height: 700,
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 600,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
      },
      tooltip: {
        enabled: true, // Enables tooltips
        y: {
          formatter: (val: number) => `${val} events`, // Custom tooltip format
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken', // Darken the segment on hover
            value: 0.15,
          },
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: true, // Expand the segment when clicked
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
              },
              value: {
                show: true,
                formatter: (val: string) => `${val}`, // Fix: Use string instead of number
              },
            },
          },
        },
      },
    };
    this.isShowPieChart = true;
  }

  createBarChart(response: { eventType: string; eventCount: number }[]): void {
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

  onSort(column: string) {
    if (this.currentSortColumn === column) {
      this.sortDirection[column] =
        this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection[column] = 'asc';
    }

    this.currentSortColumn = column;

    this.events.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA < valueB) {
        return this.sortDirection[column] === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection[column] === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.queryParams.currentPage = page;
      this.loadEventDataByUserId();
    }
  }

  loadEventDataByUserId() {
    this.isShowTable = false;
    this.analyticsService
      .getAnalytics({
        commandName: AnalyticsCommandVars.EVENTS_BY_EVENT_AND_USER,
        requiresInput: true,
        inputRequirements: [
          {
            key: 'userId',
            displayValue: 'User ID',
            dataType: 'Text',
            value: this.queryParams.userId,
          },
          {
            key: 'eventType',
            displayValue: 'Select Event Type',
            dataType: 'Select',
            value: this.queryParams.eventType,
          },
        ],
        parameters: {
          pageSize: this.queryParams.pageSize,
          currentPage: this.queryParams.currentPage,
        },
      })
      .subscribe({
        next: (response) => {
          const events = response.data?.data['events'];
          console.log(events);
          this.totalPages = Math.ceil(
            response.data?.data['total'] / this.queryParams.pageSize
          );
          if (Array.isArray(events)) {
            this.events = events;
            this.isShowTable = true;
          } else {
            this.toastService.show(
              this.toastService.createToast(
                'No data available.',
                ToastEvent.Secondary
              )
            );
          }
        },
        error: (error) => this.loggingService.error(error),
      });
  }

  handlePageSize(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    this.queryParams.pageSize = parseInt(selectElement.value, 10);
    this.loadEventDataByUserId();
  }
}
