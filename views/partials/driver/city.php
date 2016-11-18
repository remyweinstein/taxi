<?php
$json_data = array ('title' => 'Город',
            'content' => '
            <nav class="tabs">
                <ul>
                    <li data-tab="1" class="tab--active">Заказы</li>
                    <li data-tab="2">Мои заказы</li>
                </ul>
            </nav>
            <div class="tabs__wrapper">
              <div class="tabs__viewport">
                <div data-tab-content="1" class="tabs_content" data-controller="driver_city_orders">
                    <ul class="list-orders"></ul>
                </div>
                <div data-tab-content="2" class="tabs_content">
                    <div class="list-orders_norecords">Нет заказов</div>
                </div>
              </div>
            </div>
            ');
