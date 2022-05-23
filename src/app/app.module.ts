import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// *******************************************************************************
// NgBootstrap

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// *******************************************************************************
// App

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
// import { MxgraphEditComponent } from './mxgraph-edit/mxgraph-edit.component';

import { MxgraphEditModule } from '../app/mxgraph-edit/mxgraph-edit.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { VisualizationComponent } from './visualization/visualization.component';

import { ToastrModule } from 'ngx-toastr';
import { DataPointComponent } from './data-point/data-point.component';
import { DataPointModule } from './data-point/data-point.module';


// *******************************************************************************
//

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
    FacilityReportComponent,
    DataPointComponent
  ],

  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgSelectModule,

    // App
    AppRoutingModule,
    LayoutModule,
    HomeModule,
    AssetManagementModule,
    AlarmRulesModule,
    AlarmHistoricModule,
    UserManagementModule,
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
    ArchwizardModule,
    ToastrModule.forRoot(),
    DataPointModule
  ],
  providers: [
    Title,
    AppService,
    RestService
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }