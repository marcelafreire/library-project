const initMap = () => {

  const ironhack = {
    lat: -23.5617714,
    lng: -46.6601914
  }

  const map = new google.maps.Map(document.getElementById('map'), {
    center: ironhack,
    zoom: 12
  });

  axios.get('http://localhost:3000/api/books')
    .then(response => {
      console.log(response.data);

      const books = response.data;

      books.forEach(book => {

        if (book.location) {
          const [longitude, latitude] = book.location.coordinates

          const latLng = {
            lat: latitude,
            lng: longitude
          }

          new google.maps.Marker({
            position: latLng,
            map: map,
            title: book.title
          });
        }

      });
    })
    .catch(error => console.log(error));

}

initMap();