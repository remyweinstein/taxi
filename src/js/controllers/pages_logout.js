define(function () {
  
  localStorage.removeItem('_my_token');
  User.is_auth = false;
  window.history.back();

});