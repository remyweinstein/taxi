    update_taxi_order();

    timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 3000);

    function update_taxi_order() {
      Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=0&fromCity=' + User.city, '', function(response) {
        // alert(response.ok);
        if (response && response.ok) {
          var toAppend = Dom.sel('.list-orders');
           toAppend.innerHTML = '';
          var ords = response.orders;
          
          for (var i = 0; i < ords.length; i++) {
              //console.log('order '+i+': '+JSON.stringify(response.orders[i]));

              var photo_img = ords[i].agent.photo ? ords[i].agent.photo : User.avatar;
              var price = ords[i].price ? Math.round(ords[i].price) : 0;
              var bidId = ords[i].bidId;
              var active_bid = '';
              
              for (var y=0; y<ords[i].bids.length; y++) {
                var agidbid = ords[i].bids[y].id;
                
                if (agidbid === bidId) {
                    localStorage.setItem('_current_id_bid', bidId);
                    document.location = '#driver__go';
                    break;
                }
              }
              
              for (var y = 0; y < ords[i].bids.length; y++) {
                var agidbid = ords[i].bids[y].agentId;
                
                if (agidbid === User.id) {
                  active_bid = ' active';
                  break;
                }
              }
              
              var long = ords[i].agent.distance.toFixed(1);

              show('LI', '<div class="list-orders_personal"><img src="'+photo_img+'" alt="" /><br/>'+ords[i].agent.name+'<br/>'+Dates.datetimeForPeople(ords[i].created, 'TIME_AND TODAY_ONLY')+'</div><div class="list-orders_route"><div class="list-orders_route_from">'+ords[i].fromAddress+'</div><div class="list-orders_route_to">'+ords[i].toAddress0+'</div><div class="list-orders_route_info"><span>'+price+' руб.</span> <i class="icon-direction-outline"></i>'+long+' км</div><div class="list-orders_route_additional">'+ords[i].comment+'</div></div><div class="list-orders_phone"><i data-click="taxi_bid" data-id="'+ords[i].id+'" class="icon-ok-circled'+active_bid+'"></i></div>');
          }
          
          if (ords.length < 1) {
            show('DIV', '<div class="list-orders_norecords">Нет заказов</div>');
          }
          
          function show(el, a) {
            var n = document.createElement(el);
             n.innerHTML = a;
             
            toAppend.appendChild(n);                    
          }
          
        }
        
      });
    }

    var content = Dom.sel('.content');
      content.addEventListener('click', function(event) {
        var target = event.target;
        
        while (target !== this) {
              // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            var el = target;
            
            if (el.classList.contains('active')) {
              Ajax.request(server_uri, 'POST', 'delete-bid', User.token, '&id='+el.dataset.id, '', function(response) {
                if (response && response.ok) {
                  el.classList.remove('active');
                }
              });
            } else {
              Ajax.request(server_uri, 'POST', 'bid', User.token, '&id='+el.dataset.id, '', function(response) {
                //console.log(JSON.stringify('mess = '+response.messages));
                if (response && response.ok) {
                  el.classList.add('active');
                }  
              });
            }
          }
          
          target = target.parentNode;
        }
        
      });
