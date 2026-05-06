import { Component, signal, inject } from '@angular/core';
import { WebNameElement } from "../../elements/web-name";

@Component({
	selector: 'app-footer',
	imports: [WebNameElement],
	templateUrl: './footer.html',
	styleUrl: './footer.css'
})
export class Footer {
	protected readonly title = signal('Agrichain');
}
