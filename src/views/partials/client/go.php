<?php
$json_data = array ('title' => 'Заказ',
            'content' => '
                <div id="map_canvas_go"></div>
                <i class="icon-target find-me" data-click="find-me"></i>
                <div class="wait-order-approve" data-controller="taxi_client_go">
                    <div class="wait-order-approve__route-info">
                        <div class="wait-order-approve__route-info__route">
                            <div></div>
                            <div>-</div>
                            <div></div>
                        </div>
                        <div class="wait-order-approve__route-info__price">
                            
                        </div>
                        <div class="wait-order-approve__route-info__cancel">
                            
                        </div>                        
                    </div>
                </div>
                <div class="wait-bids-approve"></div>
                
                <div class="go-order__down">
                    <div class="go-order__down__driver-panel">
                        <div class="go-order__down__driver-panel__info">
                            <p>До водителя: <span data-view="distance_to_car">-</span> км.</p>
                            <p>Время подъезда: <span data-view="while_car">-</span> мин.</p>
                        </div>
                        <div class="go-order__down__driver-panel__action">
                            <button disabled data-click="client-incar" class="button_wide--green">В машине</button>
                        </div>
                    </div>
                    <div class="go-order__down__messages">
                        <div class="go-order__down__messages__textarea"></div>
                        <div class="go-order__down__messages__textinput">
                            <input type="text" name="message" data-text="new_message" placeholder="Ваше сообщение" />
                            <button class="button_rounded--green" data-click="send_message">Отправить</button>
                        </div>
                    </div>
                </div>
            ');
