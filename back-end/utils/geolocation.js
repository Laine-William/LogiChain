const geolocation = (latitude1, longitude1, latitude2, longitude2) => {
    
    const radius = 6371; // Rayon de la terre en km
    const distanceLatitude = (latitude2 - latitude1) * Math.PI / 180;
    const distanceLongitude = (longitude2 - longitude1) * Math.PI / 180;
    
    const angularDistance = Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
                            Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) *
                            Math.sin(distanceLongitude / 2) * Math.sin(distanceLongitude / 2);
    
    const calculateCircleDistance = 2 * Math.atan2(Math.sqrt(angularDistance), Math.sqrt(1 - angularDistance));
    
        return radius * calculateCircleDistance;
};

module.exports = { geolocation };