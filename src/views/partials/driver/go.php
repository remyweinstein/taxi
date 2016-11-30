<?php
$json_data = array ('title' => 'Заказ',
            'content' => '
                <div id="map_canvas_go_driver"></div>
                <div class="wait-order-approve" data-controller="taxi_driver_go">
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
                    <button data-click="driver-arrived" class="button_wide--green">Приехал</button>
                    <div class="go-order__down__messages">
                        <div class="go-order__down__messages__textarea"></div>
                        <div class="go-order__down__messages__textinput">
                            <input type="text" name="message" data-text="new_message" placeholder="Ваше сообщение" />
                            <button class="button_rounded--green" data-click="send_message">Отправить</button>
                        </div>
                    </div>
                </div>
            ');
