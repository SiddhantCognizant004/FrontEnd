import { Injectable, signal, inject, RendererFactory2, Renderer2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private renderer: Renderer2;
    private _role_selected = signal(localStorage.getItem('theme-role') || 'FARMER');
    role_selected = this._role_selected.asReadonly();

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    themeRole() {
        return this._role_selected();
    }

    themeChange(newRole: string) {
        this._role_selected.set(newRole);

        const roles = ['FARMER', 'TRADER', 'OFFICER', 'MANAGER', 'ADMIN', 'AUDITOR', 'COMPLIANCE',
                       'farmer', 'trader', 'officer', 'manager', 'admin', 'auditor'];
        roles.forEach(role => {
            this.renderer.removeClass(document.body, role);
        });

        this.renderer.addClass(document.body, newRole);
        localStorage.setItem('theme-role', newRole);
    }
}
