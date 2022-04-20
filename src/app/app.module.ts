import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// *******************************************************************************
// NgBootstrap

import { NgbModule, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

// *******************************************************************************
// App
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { AssetManagementModule } from './asset-management/asset-management.module';
import { AlarmRulesModule } from './alarm-rules/alarm-rules.module';
import { AlarmHistoricModule } from './alarm-historic/alarm-historic.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ReportGenerationModule } from './report-generation/report-generation.module';
import { EnergyManagementModule } from './energy-management/energy-management.module';
import { AssetPerformanceModule } from './asset-performance/asset-performance.module';
import { EnergyIndexModule } from './energy-index/energy-index.module';
import { CarbonEmissionModule } from './carbon-emission/carbon-emission.module';
import { DataAnalyticsModule } from './data-analytics/data-analytics.module';
import { OverviewModule } from './overview/overview.module';
import { FacilityReportModule } from './facility-report/facility-report.module';
import { MomentModule } from 'angular2-moment';
import { ArchwizardModule } from 'ng2-archwizard';
import { NgxSpinnerModule } from "ngx-spinner";

// REST service
import { RestService } from './rest.service';


// *******************************************************************************
// Pages

import { HomeComponent } from './home/home.component';
import { Page2Component } from './page-2/page-2.component';
import { AlarmHistoricComponent } from './alarm-historic/alarm-historic.component';
import { AlarmRulesComponent } from './alarm-rules/alarm-rules.component';
import { LoginComponent } from './login/login.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { EnergyManagementComponent } from './energy-management/energy-management.component';
import { WorkorderManagementComponent } from './workorder-management/workorder-management.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';
import { AssetPerformanceComponent } from './asset-performance/asset-performance.component';
import { EnergyIndexComponent } from './energy-index/energy-index.component';
import { CarbonEmissionComponent } from './carbon-emission/carbon-emission.component';
import { OverviewComponent } from './overview/overview.component';
import { FacilityReportComponent } from './facility-report/facility-report.component';

import { MxgraphEditModule } from '../app/mxgraph-edit/mxgraph-edit.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { VisualizationComponent } from './visualization/visualization.component';
import { VisualizationUserComponent } from './visualization-user/visualization-user.component';
import { WriteVisualizationModalComponent } from './visualization/write-visualization-modal/write-visualization-modal.component';
import { VerifyUserModalComponent } from './visualization/verify-user-modal/verify-user-modal.component';
import { DeleteGraphModalComponent } from './visualization/delete-graph-modal/delete-graph-modal.component'; 
import { VerifyDeleteGraphModalComponent } from './visualization/verify-delete-graph-modal/verify-delete-graph-modal.component'; 
import { ReadOnlyGptimerModalComponent } from './visualization-user/read-only-gptimer-modal/read-only-gptimer-modal.component';
import { SetGptimerModalComponent } from './visualization/set-gptimer-modal/set-gptimer-modal.component';
import { AddScheduleModalComponent } from './visualization/add-schedule-modal/add-schedule-modal.component';
import { ReadActiveAlarmComponent } from './visualization/read-active-alarm/read-active-alarm.component';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { GpTimerComponent } from './gp-timer/gp-timer.component';
import { GuardTourComponent } from './guard-tour/guard-tour.component';
import { AuditLogComponent } from './audit-log/audit-log.component';
import { VisualizationViewComponent } from './visualization-view/visualization-view.component';
import { DetailGraphComponent } from './visualization/detail-graph/detail-graph.component';
import { ChartsModule } from 'ng2-charts';
import { LZStringModule, LZStringService } from 'ng-lz-string';



// *******************************************************************************
//
// Config File
import { Config } from '../config/config';
import { TdbModule } from './tdb/tdb.module';





@NgModule({
  declarations: [
    AppComponent,

    // Pages
    HomeComponent,
    Page2Component,
    AlarmHistoricComponent,
    AlarmRulesComponent,
    LoginComponent,
    AssetManagementComponent,
    UserManagementComponent,
    EnergyManagementComponent,
    WorkorderManagementComponent,
    ReportGenerationComponent,
    DataAnalyticsComponent,
    AssetPerformanceComponent,
    EnergyIndexComponent,
    CarbonEmissionComponent,
    OverviewComponent,
    VisualizationComponent,
    GpTimerComponent,
    FacilityReportComponent,
    WriteVisualizationModalComponent,
    VerifyUserModalComponent,
    DeleteGraphModalComponent,
    VerifyDeleteGraphModalComponent,
    VisualizationUserComponent,
    VisualizationViewComponent,
    ReadOnlyGptimerModalComponent,
    SetGptimerModalComponent,
    AddScheduleModalComponent,
    ReadActiveAlarmComponent,
    GuardTourComponent,
    AuditLogComponent,
    DetailGraphComponent
  ],

  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgSelectModule,
    ChartsModule,

    // App
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    AssetManagementModule,
    AlarmRulesModule,
    AlarmHistoricModule,
    UserManagementModule,
    TdbModule,
    MxgraphEditModule,
    ReportGenerationModule,
    EnergyManagementModule,
    AssetPerformanceModule,
    EnergyIndexModule,
    CarbonEmissionModule,
    DataAnalyticsModule,
    OverviewModule,
    FacilityReportModule,
    ReactiveFormsModule,
    MomentModule,
    NgxSpinnerModule,
    ArchwizardModule,
    DragDropModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    ToastContainerModule,
    ColorPickerModule,
    NgxPaginationModule,
    LZStringModule
  ],
  providers: [
    Title,
    AppService,
    RestService,
    Config,
    LZStringService
  ],

  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    WriteVisualizationModalComponent,
    VerifyUserModalComponent,
    DeleteGraphModalComponent,
    VerifyDeleteGraphModalComponent,
    ReadOnlyGptimerModalComponent,
    SetGptimerModalComponent,
    AddScheduleModalComponent,
    ReadActiveAlarmComponent,
    DetailGraphComponent
  ]
})
export class AppModule { }