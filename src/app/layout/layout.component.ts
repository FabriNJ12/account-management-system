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
  // ============================================================
  // 🧭 NAVEGACIÓN Y ESTADO GENERAL
  // ============================================================
  currentModule: string = 'Movimientos';
  menuOpen: boolean = false;
  expandSideBar: boolean = JSON.parse(
    localStorage.getItem('MenuOpen') || 'false'
  );

  // ============================================================
  // 📂 DROPDOWNS Y MENÚ LATERAL
  // ============================================================
  expanDropdown1: boolean = false;
  expanDropdown2: boolean = false;
  expanDropdown3: boolean = false;

  // ============================================================
  // 🪟 MODALES / SESIÓN
  // ============================================================
  showModal: boolean = false;

  // ============================================================
  // ⚙️ CONSTRUCTOR
  // ============================================================
  constructor(private router: Router) {}

  // ============================================================
  // 🔄 CICLO DE VIDA
  // ============================================================
  ngOnInit(): void {
    window.addEventListener('popstate', this.handlePopState);
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handlePopState);
  }

  // ============================================================
  // 💾 LOCAL STORAGE
  // ============================================================
  setLocalStorage(): void {
    this.expandSideBar = !this.expandSideBar;
    localStorage.setItem('MenuOpen', JSON.stringify(this.expandSideBar));
  }

  // ============================================================
  // 📱 CONTROL DE NAVEGACIÓN / HISTORIAL
  // ============================================================
  toggleNav(): void {
    if (!this.menuOpen) {
      this.menuOpen = true;
      history.pushState({ menuOpen: true }, '', window.location.href);
    } else {
      this.menuOpen = false;
    }
  }

  handlePopState = (event: PopStateEvent): void => {
    if (this.menuOpen) {
      this.menuOpen = false;
      // Evita navegar hacia atrás realmente
      history.pushState(null, '', window.location.href);
    }
  };

  // ============================================================
  // 🚀 NAVEGACIÓN ENTRE MÓDULOS
  // ============================================================
  navigation(route: string): void {
    setTimeout(() => {
      this.menuOpen = false;

      switch (route) {
        case 'Movimientos':
          this.router.navigate(['dashboard']);
          break;
        case 'Alta Clientes':
          this.router.navigate(['customers']);
          break;
        default:
          return;
      }

      this.currentModule = route;
    }, 100);
  }

  toModify_inventory(): void {
    this.router.navigate(['modify-inventory']);
  }

  // ============================================================
  // 🔐 SESIÓN / CIERRE DE SESIÓN
  // ============================================================
  LogOut(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['login']);
  }
}
