import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GeocodingComponent} from './geocoding/geocoding.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MapComponent} from './map/map.component';
import {MapPointFormComponent} from './map-point-form/map-point-form.component';
import {ResultsListComponent} from './results-list/results-list.component';
import {TruncatePipe} from './shared/pipes/truncate.pipe';
import {OrderByPipe} from './shared/pipes/order-by.pipe';
import {DatePipe} from '@angular/common';
import {FilterPipe} from './shared/pipes/filter.pipe';
import {NominatimService} from './services/nominatim-service';
import {SightingService} from './shared/services/sighting.service';
import {HeaderComponent} from './core/components/header/header.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';

@NgModule({
  declarations: [
    AppComponent,
    GeocodingComponent,
	HeaderComponent,
    MapComponent,
    MapPointFormComponent,
    ResultsListComponent,
	TruncatePipe,
	FilterPipe,
	OrderByPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LeafletModule,
    FormsModule,
	ScrollingModule,
	LeafletMarkerClusterModule
  ],
  providers: [
	NominatimService,
	SightingService,
	DatePipe,
	FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
