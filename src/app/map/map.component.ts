import { Component, OnInit } from "@angular/core";
import {
	divIcon,
  icon,
  LatLng,
  latLng,
  LayerGroup,
  LeafletMouseEvent,
  Map,
  MapOptions,
  marker,
  tileLayer,
} from "leaflet";
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  SIGHTINGS,
  Sighting,
} from "../app.constants";
import { isAfter, isEqual, startOfDay, subDays } from 'date-fns'
import { MapPoint } from "../shared/models/map-point.model";
import { NominatimResponse } from "../shared/models/nominatim-response.model";
import {DatePipe} from '@angular/common';
import {SightingService} from '../shared/services/sighting.service';
import {debounceTime, distinctUntilChanged, map, tap} from 'rxjs/operators';
import {FilterPipe} from '../shared/pipes/filter.pipe';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  markerGroup: LayerGroup = new LayerGroup();

  results: NominatimResponse[];

  constructor(private datePipe: DatePipe, private filterPipe: FilterPipe, private sightingService: SightingService) {}

  ngOnInit() {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
	this.sightingService.getSelectedSighting().subscribe(sight => {
		if (sight) {
			const coords = new LatLng(+sight.coordinates.lat, +sight.coordinates.lng)
			this.map.setView(coords, this.map.getZoom(), { animate: true });
		}
	})
	this.sightingService.getFilterStr().pipe(debounceTime(400), distinctUntilChanged()).subscribe(filterStr => {
		const filteredSightings = this.filterPipe.transform(SIGHTINGS, filterStr);
		this.clearMarkers();
		this.createMarkers(filteredSightings);
	})
  }

  initializeMap(map: Map) {
    this.map = map;
    this.createMarkers(SIGHTINGS);
	 const coordinates = latLng([
      this.mapPoint.latitude,
      this.mapPoint.longitude,
    ]);
    this.map.setView(coordinates, this.map.getZoom());
  }

//   getAddress(result: NominatimResponse) {
//     this.updateMapPoint(result.latitude, result.longitude, result.displayName);
//     this.createMarkers();
//   }

  refreshSearchList(results: NominatimResponse[]) {
    this.results = results;
  }

  onMapClick(e: LeafletMouseEvent) {
    this.clearMarkers();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng);
  }

  initializeMapOptions() {
    this.options = {
      zoom: 12,
      layers: [
        tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "OSM",
        }),
      ],
    };
  }

  initializeDefaultMapPoint() {
    this.mapPoint = {
      name: "Hello",
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
    };
  }

  updateMapPoint(latitude: number, longitude: number, name?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name,
    };
  }

  createMarkers(sightings: Sighting[]) {
    for (const sight of sightings) {
      const coordinates = latLng([
        +sight.coordinates.lat,
        +sight.coordinates.lng,
      ]);
      const icon = this.getIcon(sight);
      marker(coordinates)
        .setIcon(icon)
        .on("click", this.markerOnClick, sight)
        .bindTooltip(sight.species, { direction: "top" })
        .bindPopup(this.getPopupContent(sight))
        .addTo(this.markerGroup);
    }
	this.markerGroup.addTo(this.map);
  }

  markerOnClick(e) {
    // // "this" = the clicked sighting object
    // console.log(this);
    // console.log(e);
  }

  getIcon(sight: Sighting) {
    return icon({
		iconUrl: this.getIconAsset(sight),
		shadowUrl: 'assets/img/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		tooltipAnchor: [1 , -45],
		popupAnchor: [1, -45],
		shadowSize: [41, 41]
    });
  }

  getIconAsset(sight: Sighting): string {
	const today = startOfDay(new Date());
    const sightDate = new Date(sight.sightDate);

    if (isAfter(sightDate, today) || isEqual(sightDate, today)) {
      return "assets/img/marker-icon-red.png";
    } else if (isAfter(sightDate, subDays(today, 3)) || isEqual(sightDate, subDays(today, 3))) {
      return "assets/img/marker-icon-orange.png";
    } else if (isAfter(sightDate, subDays(today, 7)) || isEqual(sightDate, subDays(today, 7))) {
      return "assets/img/marker-icon-grey.png";
    } else {
      return "assets/img/marker-icon-black.png";
    }
  }

  getPopupContent(sight: Sighting): string {
    return (
      this.datePipe.transform(sight.sightDate, 'dd.MM.yyyy') +
      "<br> " +
      sight.species +
      " " +
      sight.amount +
      "kpl" +
      "<br> " +
      sight.details +
      "<br>" +
      "<a href='https://www.tiira.fi/selain/naytahavis.php?id=" +
      sight.id +
      "' target='_blank'>Avaa</a>"
    );
  }

  clearMarkers() {
	this.markerGroup.clearLayers();
  }
}
