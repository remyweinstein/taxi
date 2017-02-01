/* global User */

define(['Ajax', 'Destinations'], function (Ajax, Destinations) {
  
  function addFav(el) {
    Ajax.request('POST', 'favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
      }
    }, Ajax.error);
  }
  
  function deleteFav(el) {
    Ajax.request('POST', 'delete-favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtofav">Избранное</button>';
      }
    }, Ajax.error);
  }
  
  function addBlack(el) {
    Ajax.request('POST', 'black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
      }
    }, Ajax.error); 
  }
  
  function deleteBlack(el) {
    Ajax.request('POST', 'delete-black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
      }
    }, Ajax.error); 
  }
  
  var Destinations = {
    addFav: function (el) {
      addFav(el);
    },
    deleteFav: function (el) {
      deleteFav(el);
    },
    addBlack: function (el) {
      addBlack(el);
    },
    deleteBlack: function (el) {
      deleteBlack(el);
    }
  };
  
  return Destinations;
  
  });