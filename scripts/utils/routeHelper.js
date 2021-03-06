import RouteParser from 'route-parser';
import { hashHistory } from 'react-router';

const searchRoute = '(/record_ids/:record_ids)(/search/:search)(/search_field/:search_field)(/category/:category)(/year_from/:year_from)(/year_to/:year_to)(/person_relation/:person_relation)(/gender/:gender)(/person_landskap/:person_landskap)(/person_county/:person_county)(/person_harad/:person_harad)(/person_socken/:person_socken)(/nordic/:nordic)(/has_metadata/:has_metadata)';
const placesRoute = '/places(/type/:type)(/record_ids/:record_ids)(/search/:search)(/search_field/:search_field)(/category/:category)(/year_from/:year_from)(/year_to/:year_to)(/person_relation/:person_relation)(/gender/:gender)(/person_landskap/:person_landskap)(/person_county/:person_county)(/person_harad/:person_harad)(/person_socken/:person_socken)(/nordic/:nordic)(/has_metadata/:has_metadata)(/page/:page)';
const placeRoute = '/place/:place_id(/type/:type)(/record_ids/:record_ids)(/search/:search)(/search_field/:search_field)(/category/:category)(/year_from/:year_from)(/year_to/:year_to)(/person_relation/:person_relation)(/gender/:gender)(/person_landskap/:person_landskap)(/person_county/:person_county)(/person_harad/:person_harad)(/person_socken/:person_socken)(/nordic/:nordic)(/has_metadata/:has_metadata)(/page/:page)';
const recordRoute = '/record/:record_id(/type/:type)(/record_ids/:record_ids)(/search/:search)(/search_field/:search_field)(/category/:category)(/year_from/:year_from)(/year_to/:year_to)(/person_relation/:person_relation)(/gender/:gender)(/person_landskap/:person_landskap)(/person_county/:person_county)(/person_harad/:person_harad)(/person_socken/:person_socken)(/nordic/:nordic)(/has_metadata/:has_metadata)(/page/:page)';

export default {
	createPlacePathFromPlaces(placeId, placesPath) {
		var router = new RouteParser(placesRoute);
		var routeParams = router.match(placesPath) || {};

		routeParams.place_id = placeId;
		router = new RouteParser(placeRoute);

		return router.reverse(routeParams);
	},

	createPlacesPathFromPlace(placePath) {
		var router = new RouteParser(placeRoute);
		var routeParams = router.match(placePath) || {
		};

		if (routeParams.place_id) {
			delete routeParams.place_id;
		}

		router = new RouteParser(placesRoute);

		return router.reverse(routeParams);
	},

	createPlacesPathFromRecord(recordId) {
		var router = new RouteParser(recordRoute);
		var routeParams = router.match(recordId) || {
		};

		if (routeParams.record_id) {
			delete routeParams.record_id;
		}

		router = new RouteParser(placesRoute);

		return router.reverse(routeParams);
	},

	createSearchRoute(params) {
		var router = new RouteParser(searchRoute);

		return router.reverse(params);
	}
}
