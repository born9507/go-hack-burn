const enter = async () => {
  await axios.post('/api/login', {
    'name': document.getElementById('name').value,
    'univ': document.getElementById('univ').value
  })
  .then(function (response) {
    console.log(response.data);
    window.location.href='/';
  })
  .catch(function (error) {
    console.log(error);
  });
}
