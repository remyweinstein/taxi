<?php
$json_data = array ('title' => 'Выбор адреса',
            'content' => '
                <div class="choice-location">
                    <p data-controller="taxi_client_choose_address">
                        <input type="text" name="enter-address" value="" placeholder="Введите адрес" />
                    </p>
                    <div class="choice-location__results-search"></div>
                </div>
                <div id="hide_map"></div>
                ',
    'pageType' => 'back-arrow');