import { Routes } from '@angular/router';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

import { LayoutComponent } from './layout/layout.component';
import { CustomersComponent } from './layout/customers/customers.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // Layout siempre visible
    children: [
      { path: '', redirectTo: 'customers', pathMatch: 'full' }, // default child
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomersComponent },
    ],
  },
];
