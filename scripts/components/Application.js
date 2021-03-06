import React from 'react';
import { hashHistory } from 'react-router';

import MapView from './../../ISOF-React-modules/components/views/MapView';
import RoutePopupWindow from './../../ISOF-React-modules/components/controls/RoutePopupWindow';

import routeHelper from './../utils/routeHelper';

import EventBus from 'eventbusjs';

export default class Application extends React.Component {
	constructor(props) {
		super(props);

		/* Global applicationSettings, includeNordic = false betyder att vi inkluderar inte norskt material som standard
			includeNordic används av ISOF-React-modules/components/collections/MapCollection.js och
			ISOF-React-modules/components/collections/RecordsCollection.js i Nordisk_sägenkarta branchen.
		*/
		window.applicationSettings = {
			includeNordic: false
		};

		var queryObject = parse_query_string(window.location.search.substring(1));

		if (queryObject.landingPage) {
			window.applicationSettings.landingPage = queryObject.landingPage;
		}

		// Lägg till globalt eventBus variable för att skicka data mellan moduler
		window.eventBus = EventBus;

		// Bind event handlers till "this" (själva Application instance)
		this.mapMarkerClick = this.mapMarkerClick.bind(this);
		this.popupCloseHandler = this.popupCloseHandler.bind(this);
		this.popupWindowHideHandler = this.popupWindowHideHandler.bind(this);
		this.popupWindowShowHandler = this.popupWindowShowHandler.bind(this);
 
		this.languageChangedHandler = this.languageChangedHandler.bind(this);

		this.state = {
			selectedCategory: null,

			searchValue: '',
			searchField: '',
			searchMetadata: false,

			mapTitle: queryObject.mapTitle,
			queryObject: queryObject,

			params: this.props.params,
			popupVisible: false
		};
	}

	mapMarkerClick(placeId) {
		hashHistory.push(routeHelper.createPlacePathFromPlaces(placeId, this.props.location.pathname));
	}

	popupCloseHandler() {
		if (hashHistory.getCurrentLocation().pathname.indexOf('record/') > -1) {
			hashHistory.push(routeHelper.createPlacesPathFromRecord(hashHistory.getCurrentLocation().pathname));
		}
		else if (hashHistory.getCurrentLocation().pathname.indexOf('place/') > -1) {
			hashHistory.push(routeHelper.createPlacesPathFromPlace(hashHistory.getCurrentLocation().pathname));
		}
	}

	popupWindowShowHandler() {
		setTimeout(function() {
			this.setState({
				popupVisible: true
			});
		}.bind(this), 10);
	}

	popupWindowHideHandler() {
		setTimeout(function() {
			this.setState({
				popupVisible: false
			});
		}.bind(this), 10);
	}

	languageChangedHandler() {
		console.log('language changed');
		this.forceUpdate();
	}

	componentDidMount() {
		if (this.props.params.nordic) {
			window.eventBus.dispatch('nordicLegendsUpdate', null, {includeNordic: true});			
		}

		if (window.eventBus) {
			eventBus.dispatch('application.searchParams', {
				selectedType: this.props.params.type,
				selectedCategory: this.props.params.category,
				searchValue: this.props.params.search,
				searchField: this.props.params.search_field,
				searchYearFrom: this.props.params.year_from,
				searchYearTo: this.props.params.year_to,
				searchPersonRelation: this.props.params.person_relation,
				searchGender: this.props.params.gender,
				searchMetadata: this.props.params.has_metadata,
				includeNordic: this.props.params.nordic
			});

			window.eventBus.addEventListener('Lang.setCurrentLang', this.languageChangedHandler);
		}

		this.setState({
			selectedType: this.props.params.type,
			selectedCategory: this.props.params.category,
			searchValue: this.props.params.search,
			searchField: this.props.params.search_field,
			searchYearFrom: this.props.params.year_from,
			searchYearTo: this.props.params.year_to,
			searchPersonRelation: this.props.params.person_relation,
			searchGender: this.props.params.gender,
			searchMetadata: this.props.params.has_metadata,
			params: this.props.params
		}, function() {
			setTimeout(function() {
				document.body.classList.add('app-initialized');
			}.bind(this), 1000);
		}.bind(this));
	}

	componentWillReceiveProps(props) {
		if (window.eventBus) {
			eventBus.dispatch('application.searchParams', {
				selectedType: props.params.type,
				selectedCategory: props.params.category,
				searchValue: props.params.search,
				searchField: props.params.search_field,
				searchYearFrom: props.params.year_from,
				searchYearTo: props.params.year_to,
				searchPersonRelation: props.params.person_relation,
				searchGender: props.params.gender,
				includeNordic: props.params.nordic,
				searchMetadata: props.params.has_metadata
			});
		}

		this.setState({
			selectedType: props.params.type,
			selectedCategory: props.params.category,
			searchValue: props.params.search,
			searchField: props.params.search_field,
			searchYearFrom: props.params.year_from,
			searchYearTo: props.params.year_to,
			searchPersonRelation: props.params.person_relation,
			searchGender: props.params.gender,
			searchMetadata: props.params.has_metadata,
			params: props.params
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (JSON.stringify(nextState) != JSON.stringify(this.state));
	}

	cleanAppHashString(hashString) {
		return hashString.replace(/\/type\/[^\/]*/g, '');
	}

	render() {
		const {
			popup
		} = this.props;

		var titleEl;
		if (this.state.queryObject.mapTitle) {
			if (this.state.queryObject.landingPage) {
				titleEl = <a target="_parent" href={this.state.queryObject.landingPage+'#'+this.state.queryObject.searchParams} className="map-title">{this.state.queryObject.mapTitle}</a>;
			}
			else {
				titleEl = <div className="map-title">{this.state.queryObject.mapTitle}</div>;
			}
		}

		return (
			<div className={'app-container'+(this.state.popupVisible ? ' has-overlay' : '')}>

				<MapView searchParams={this.state.params} 
					onMarkerClick={this.mapMarkerClick} 
					hideMapmodeMenu="true" 
					zoomControlPosition="bottomright" 
					layersControlPosition="bottomright" />

				<RoutePopupWindow onShow={this.popupWindowShowHandler} 
					onHide={this.popupWindowHideHandler} 
					router={this.context.router} 
					onClose={this.popupCloseHandler}
				>
					{popup}
				</RoutePopupWindow>

				{titleEl}

				<div className="map-progress"><div className="indicator"></div></div>

			</div>
		);
	}
}