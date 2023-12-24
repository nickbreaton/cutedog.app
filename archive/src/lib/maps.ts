import {
  AddressType,
  PlaceType1,
  PlaceType2,
  type ReverseGeocodeResponseData,
} from "@googlemaps/google-maps-services-js";

export async function getCityState(lat: number, lng: number) {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", [lat, lng].join(","));
  url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY!);
  const res = await fetch(url);
  const { results } = (await res.json()) as ReverseGeocodeResponseData;
  const fromLocality = results.find(({ types }) => types.includes(AddressType.locality));
  return {
    city: fromLocality!.address_components.find(({ types }) => {
      return types.includes(AddressType.locality);
    })!.long_name,
    state: fromLocality!.address_components.find(({ types }) => {
      return types.includes(AddressType.administrative_area_level_1);
    })!.short_name,
  };
}
