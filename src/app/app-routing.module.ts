import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// *******************************************************************************
// Layouts

import { Layout2Component } from './layout/layout-2/layout-2.component';

// *******************************************************************************
// Pages

import { HomeComponent } from './home/home.component';
import { Page2Component } from './page-2/page-2.component';
import { AlarmHistoricComponent } from './alarm-historic/alarm-historic.component';
import { AlarmRulesComponent } from './alarm-rules/alarm-rules.component';
import { LoginComponent } from './login/login.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { WorkorderManagementComponent } from './workorder-management/workorder-management.component';
import { EnergyManagementComponent } from './energy-management/energy-management.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';
import { AssetPerformanceComponent } from './asset-performance/asset-performance.component';
import { EnergyIndexComponent } from './energy-index/energy-index.component';
import { CarbonEmissionComponent } from './carbon-emission/carbon-emission.component';
import { OverviewComponent } from './overview/overview.component';

import { VisualizationComponent } from './visualization/visualization.component';
import { FacilityReportComponent } from './facility-report/facility-report.component';

// Authentication
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { DataPointComponent } from './data-point/data-point.component';
import { ListDataPointComponent } from './data-point/list-data-point/list-data-point.component';
import { CctvComponent } from './cctv/cctv/cctv.component';

// *******************************************************************************
// Routes

const routes: Routes = [
  // Home
  {
    path: '', component: Layout2Component, pathMatch: 'full', canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: OverviewComponent },
    ]
  },

  // Alarm Dashboard
  {
    path: 'alarm/dashboard', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: HomeComponent },
    ]
  },


  // Rule Engine
  {
    path: 'alarm/rules', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: AlarmRulesComponent },
    ]
  },

  // Asset Management
  {
    path: 'asset/manage', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: AssetManagementComponent },
    ]
  },

  // Alarm History
  {
    path: 'alarm/historic', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: AlarmHistoricComponent },
    ]
  },

  // User Management
  {
    path: 'user/manage', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: UserManagementComponent },
    ]
  },

  // Workorder Management Dashboard
  {
    path: 'workorder/dashboard', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: WorkorderManagementComponent },
    ]
  },

  // Energy Management Dashboard
  {
    path: 'energy/dashboard', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: EnergyManagementComponent },
    ]
  },

  // Report Generation
  {
    path: 'report/generate', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: ReportGenerationComponent },
    ]
  },

  // Report Generation
  {
    path: 'eod/generate', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: ReportGenerationComponent },
    ]
  },

  // Report Generation
  {
    path: 'alarm/generate', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: ReportGenerationComponent },
    ]
  },

  // Data Analytics
  {
    path: 'eod/analytics', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: DataAnalyticsComponent },
    ]
  },

  // Asset Performance
  {
    path: 'eod/assetperformance', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: AssetPerformanceComponent },
    ]
  },

  // Energy Management - Energy Index
  {
    path: 'energy/energyindex', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: EnergyIndexComponent },
    ]
  },

  // Energy Management - Carbon Emission
  {
    path: 'energy/carbonemission', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: CarbonEmissionComponent },
    ]
  },

  // Visualization 
  {
    path: 'visualization', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: VisualizationComponent },
    ]
  },

  // Data Entry - Facility Report 
  {
    path: 'dataentry/facility', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: FacilityReportComponent },
    ]
  },

  // Data point - Facility Data Input 
  {
    path: 'data-point/facility', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: DataPointComponent },
    ]
  },

  // List Of Data point - Facility Data Input 
  {
    path: 'data-point/list', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: ListDataPointComponent },
    ]
  },

  {
    path: 'cctv/list', component: Layout2Component, canActivate: [AuthGuard], runGuardsAndResolvers: 'always', children: [
      { path: '', component: CctvComponent },
    ]
  },

  // Login
  { path: 'login', component: LoginComponent },

  // Invalid route
  //{ path: '**', component: Layout2Component, children: [
  //  { path: '**', component: HomeComponent },
  //]},
];

// *******************************************************************************
//

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule { }