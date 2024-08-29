export type DirectionsResponse = {
  routes: DirectionsRoute[]; // required
  status: DirectionsStatus; // required
  available_travel_modes?: TravelMode[]; // optional
  error_message?: string; // optional
  geocoded_waypoints?: DirectionsGeocodedWaypoint[]; // optional
};

type DirectionsRoute = {
  bounds: Bounds; // required
  copyrights: string; // required
  legs: DirectionsLeg[]; // required
  overview_polyline: DirectionsPolyline; // required
  summary: string; // required
  warnings: string[]; // required
  waypoint_order: number[]; // required
  fare?: Fare; // optional
};

type Bounds = {
  northeast: LatLngLiteral; // required
  southwest: LatLngLiteral; // required
};

type LatLngLiteral = {
  lat: number; // required
  lng: number; // required
};

type DirectionsLeg = {
  end_address: string; // required
  end_location: LatLngLiteral; // required
  start_address: string; // required
  start_location: LatLngLiteral; // required
  steps: DirectionsStep[]; // required
  traffic_speed_entry: DirectionsTrafficSpeedEntry[]; // required
  via_waypoint: DirectionsViaWaypoint[]; // required
  arrival_time?: TimeZoneTextValueObject; // optional
  departure_time?: TimeZoneTextValueObject; // optional
  distance?: TextValueObject; // optional
  duration?: TextValueObject; // optional
  duration_in_traffic?: TextValueObject; // optional
};

type DirectionsStep = {
  duration: TextValueObject; // required
  end_location: LatLngLiteral; // required
  html_instructions: string; // required
  polyline: DirectionsPolyline; // required
  start_location: LatLngLiteral; // required
  travel_mode: TravelMode; // required
  distance?: TextValueObject; // optional
  maneuver?: string; // optional
  steps?: DirectionsStep[]; // optional
  transit_details?: DirectionsTransitDetails; // optional
};

type DirectionsPolyline = {
  points: string; // required
};

type TextValueObject = {
  text: string; // required
  value: number; // required
};

type TravelMode = "DRIVING" | "BICYCLING" | "TRANSIT" | "WALKING";

type DirectionsTransitDetails = {
  arrival_stop?: DirectionsTransitStop; // optional
  arrival_time?: TimeZoneTextValueObject; // optional
  departure_stop?: DirectionsTransitStop; // optional
  departure_time?: TimeZoneTextValueObject; // optional
  headsign?: string; // optional
  headway?: number; // optional
  line?: DirectionsTransitLine; // optional
  num_stops?: number; // optional
  trip_short_name?: string; // optional
};

type DirectionsTransitStop = {
  location: LatLngLiteral; // required
  name: string; // required
};

type TimeZoneTextValueObject = {
  text: string; // required
  time_zone: string; // required
  value: number; // required
};

type DirectionsTransitLine = {
  agencies: DirectionsTransitAgency[]; // required
  name: string; // required
  color?: string; // optional
  icon?: string; // optional
  short_name?: string; // optional
  text_color?: string; // optional
  url?: string; // optional
  vehicle?: DirectionsTransitVehicle; // optional
};

type DirectionsTransitAgency = {
  name?: string; // optional
  phone?: string; // optional
  url?: string; // optional
};

type DirectionsTransitVehicle = {
  name: string; // required
  type: VehicleType; // required
  icon?: string; // optional
  local_icon?: string; // optional
};

type VehicleType =
  | "BUS"
  | "CABLE_CAR"
  | "COMMUTER_TRAIN"
  | "FERRY"
  | "FUNICULAR"
  | "GONDOLA_LIFT"
  | "HEAVY_RAIL"
  | "HIGH_SPEED_TRAIN"
  | "INTERCITY_BUS"
  | "LONG_DISTANCE_TRAIN"
  | "METRO_RAIL"
  | "MONORAIL"
  | "OTHER"
  | "RAIL"
  | "SHARE_TAXI"
  | "SUBWAY"
  | "TRAM"
  | "TROLLEYBUS";

type DirectionsTrafficSpeedEntry = {
  offset_meters: number; // required
  speed_category: string; // required
};

type DirectionsViaWaypoint = {
  location?: LatLngLiteral; // optional
  step_index?: number; // optional
  step_interpolation?: number; // optional
};

type Fare = {
  currency: string; // required
  text: string; // required
  value: number; // required
};

type DirectionsStatus =
  | "OK"
  | "NOT_FOUND"
  | "ZERO_RESULTS"
  | "MAX_WAYPOINTS_EXCEEDED"
  | "MAX_ROUTE_LENGTH_EXCEEDED"
  | "INVALID_REQUEST"
  | "OVER_DAILY_LIMIT"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

type DirectionsGeocodedWaypoint = {
  geocoder_status?: "OK" | "ZERO_RESULTS"; // optional
  partial_match?: boolean; // optional
  place_id?: string; // optional
  types?: string[]; // optional
};
