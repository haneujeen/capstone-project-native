export function calculateDistance(userLat, userLon, busLat, busLon) {
    const EARTH_RADIUS = 6371e3;
  
    const userLatInRadians = userLat * Math.PI / 180;
    const busLatInRadians = busLat * Math.PI / 180;
  
    const diffLatInRadians = (busLat - userLat) * Math.PI / 180;
    const diffLonInRadians = (busLon - userLon) * Math.PI / 180;
  
    const a = Math.sin(diffLatInRadians / 2) * Math.sin(diffLatInRadians / 2) +
              Math.cos(userLatInRadians) * Math.cos(busLatInRadians) *
              Math.sin(diffLonInRadians / 2) * Math.sin(diffLonInRadians / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = EARTH_RADIUS * c;
  
    return distance;
  }
  