import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router) {}
  expanDropdown1: boolean = false;
  expanDropdown2: boolean = false;
  expanDropdown3: boolean = false;
  expandSideBar: boolean = JSON.parse(localStorage.getItem('MenuOpen')!);
  menuOpen: boolean = false;

  setLocalStorage() {
    this.expandSideBar = !this.expandSideBar;
    localStorage.setItem('MenuOpen', JSON.stringify(this.expandSideBar));
  }

  ngOnInit(): void {
    window.addEventListener('popstate', this.handlePopState);
  }

  toggleNav() {
    if (!this.menuOpen) {
      this.menuOpen = true;
      history.pushState({ menuOpen: true }, '', window.location.href);
    } else {
      this.menuOpen = false;
    }
  }

  handlePopState = (event: PopStateEvent) => {
    if (this.menuOpen) {
      this.menuOpen = false;
      // Evita navegar hacia atrás realmente
      history.pushState(null, '', window.location.href);
    }
  };

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handlePopState);
  }

  toModify_inventory() {
    this.router.navigate(['modify-inventory']);
  }

  currentModule: string = 'Movimientos';

  navigation(route: string) {
    setTimeout(() => {
      this.menuOpen = false;
      if (route === 'Movimientos') {
        this.router.navigate(['dashboard']);
        this.currentModule = route;
        return;
      } else if (route === 'Alta Clientes') {
        this.router.navigate(['customers']);
        this.currentModule = route;
      }
    }, 100);
  }

  showModal: boolean = false;
  LogOut() {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['login']);
  }
}
