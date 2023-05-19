import { Injectable } from "@angular/core";
import {BehaviorSubject, Observable, of} from 'rxjs';
import {SIGHTINGS, Sighting} from 'src/app/app.constants';


@Injectable({
	providedIn: "root",
})
export class SightingService {
	private selectedSighting: BehaviorSubject<Sighting> = new BehaviorSubject<Sighting>(null);
	private filterSub: BehaviorSubject<string> = new BehaviorSubject<string>("");

	sightings = of(SIGHTINGS);
	filterStr = this.filterSub.asObservable();

	constructor() {}

	getSightings(): Observable<Sighting[]> {
		return of(SIGHTINGS);
	}

	selectSighting(sighting: Sighting): void {
		this.selectedSighting.next(sighting);
	}

	getSelectedSighting(): Observable<Sighting> {
		return this.selectedSighting.asObservable();
	}

	setFilterStr(str: string) {
		this.filterSub.next(str);
	}

	getFilterStr() {
		return this.filterSub.asObservable();
	}


}
