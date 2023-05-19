import {AfterViewInit, Component, EventEmitter, HostBinding, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {SIGHTINGS, Sighting} from '../app.constants';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {SightingService} from '../shared/services/sighting.service';
import {Kunta} from '../shared/enums/kunta.enum';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements AfterViewInit, OnDestroy {
	@ViewChild(CdkVirtualScrollViewport, {static: false})
    public viewPort: CdkVirtualScrollViewport;
	destroy$ = new Subject<boolean>();

	order = '-sightDate';
	stickyOffset = '0px';

	constructor (public sightingService: SightingService) {
	}

	ngOnInit() {
	}

   ngAfterViewInit() {
	// keeps the header row at the top when scrolling
    this.viewPort.renderedRangeStream
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.viewPort.checkViewportSize();
        this.stickyOffset =
          -(this.viewPort.getOffsetToRenderedContentStart() || 0) + "px";
      });
  }

  onFilterKeyup(event) {
	const filterStr = event.target.value;
	this.sightingService.setFilterStr(filterStr);
  }

  selectResult(sight: Sighting) {
	this.sightingService.selectSighting(sight);
  }

  sort(clickedOrder: string) {
	const currentOrder = this.order.startsWith('-') ? this.order.slice(1) : this.order;
	const newOrder = clickedOrder.startsWith('-') ? clickedOrder.slice(1) : clickedOrder;
	if (currentOrder == newOrder) {
		this.order = this.order.startsWith('-') ? this.order.slice(1) : '-' + this.order;
	} else {
		this.order = clickedOrder;
	}
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

}
