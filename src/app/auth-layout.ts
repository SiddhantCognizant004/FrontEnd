import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'auth-layout',
    imports: [RouterOutlet],
    template: `<router-outlet />`
})
export class AuthLayoutComponent {
    protected readonly title = signal('Agrichain');
}
