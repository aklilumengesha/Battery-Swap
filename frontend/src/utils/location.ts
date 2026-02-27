import axios from "axios";
import { logger } from "./logger";

const locSuccessHandler = (pos, setLocation) => {
  axios
    .get(
      `https://us1.locationiq.com/v1/reverse.php?key=80c6277b4fd80d&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
    )
    .then(function (response) {
      const locArray = response.data.display_name?.split(" ") ?? [];
      const location = {
        name: locArray
          ?.slice(locArray?.length - 4, locArray?.length - 1)
          ?.join(" "),
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setLocation(location);
      localStorage.setItem("location", JSON.stringify(location));
    });
};

const locErrorHandler = (error, setLocation) => {
  logger.error(error, "getViaLocationiq()");
  const location = localStorage.getItem("location");
  if (location) setLocation(JSON.parse(location));
  else
    setLocation({
      name: "Kochi, Kerala",
      latitude: 9.9312,
      longitude: 76.2673,
    });
};

const getViaLocationiq = (setLocation) => {
  navigator.geolocation.getCurrentPosition(
    (pos) => locSuccessHandler(pos, setLocation),
    (error) => locErrorHandler(error, setLocation),
    { enableHighAccuracy: true }
  );
};

export const get_distance_btw = (lat1: number, lon1: number, currLat: number, currLon: number): string => {
  // deg -> rad
  let lon1Rad = lon1 * (Math.PI / 180);
  let currLonRad = currLon * (Math.PI / 180);
  let lat1Rad = lat1 * (Math.PI / 180);
  let currLatRad = currLat * (Math.PI / 180);

  // Haversine formula
  const dlon = currLonRad - lon1Rad;
  const dlat = currLatRad - lat1Rad;
  const c =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(dlat / 2) ** 2 +
          Math.cos(lat1Rad) * Math.cos(currLatRad) * Math.sin(dlon / 2) ** 2
      )
    );

  // radius of earth = 6371 km or 3956 miles
  const d = c * 6371 * 1000;

  let distance: string;
  if (d > 1000) {
    distance = String(d / 1000) + " km";
  } else {
    distance = String(d) + " m";
  }
  return distance;
};

export const getLocation = getViaLocationiq;
