<?php
$json_data = array ('title' => 'Город',
            'content' => '
            <div id="map_canvas_iam"></div>
            <form action="/" method="POST" data-controller="taxi_client_city" data-submit="taxy_client_city" onsubmit="return false;" class="form-order-city">
                <div class="form-order-city__field order-city-from">
                    <i class="icon-right-circled form-order-city__label"></i>
                    <span class="form-order-city__wrap"><input id="autocomplete" class="adress_from" type="text" name="from" value="" placeholder="Откуда" autocomplete="off" /></span>
                    <i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>
                </div>
                <div class="form-order-city__field order-city-to">
                    <i class="icon-left-circled form-order-city__label"></i>
                    <span class="form-order-city__wrap"><input class="adress_to" type="text" name="to" value="" placeholder="Куда"/></span>
                    <span data-click="field_add" class="form-order-city__field_add"><i class="icon-plus-circle"></i></span>
                    <i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>
                </div>
                <div class="form-order-city__field">
                    <i class="icon-commerical-building form-order-city__label"></i>
                    <span class="form-order-city__wrap"><input type="text" name="description" value="" placeholder="Подъезд, комментарий"/></span>
                </div>
                <div class="form-order-city__bottom">
                    <div class="form-order-city__field">
                        <i class="icon-rouble form-order-city__label"></i>
                        <span class="form-order-city__wrap"><input class="input_only_digits" type="text" name="cost" value="" placeholder="Предложите цену"/></span>
                    </div>
                    <button class="button_rounded--green" data-click="order-taxi">Заказать</button>
                </div>
            </form>
            ');