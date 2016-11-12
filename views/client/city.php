<?php
$json_data = array ('title' => 'Город',
            'content' => '
                <form action="/#client__map" method="POST" class="form-order-city">
                <div class="form-order-city__field order-city-from">
                    <i class="icon-right-circled form-order-city__label jq_choice_location"></i>
                    <span class="form-order-city__wrap"><input id="autocomplete" class="adress_from" type="text" name="from" value="" placeholder="Откуда" autocomplete="off" /></span>
                </div>
                <div class="form-order-city__field">
                    <i class="icon-left-circled form-order-city__label jq_choice_location"></i>
                    <span class="form-order-city__wrap"><input class="adress_to" type="text" name="to" value="" placeholder="Куда"/></span>
                    <span class="form-order-city__field_add"><i class="icon-plus-circle"></i></span>
                </div>
                <div class="form-order-city__field">
                    <i class="icon-rouble form-order-city__label"></i>
                    <span class="form-order-city__wrap"><input class="input_only_digits" type="text" name="cost" value="" placeholder="Предложите цену"/></span>
                </div>
                <div class="form-order-city__field">
                    <i class="icon-commerical-building form-order-city__label"></i>
                    <span class="form-order-city__wrap"><input type="text" name="description" value="" placeholder="Подъезд, комментарий"/></span>
                </div>
                <div class="gBlock">
                    <button class="button_rounded--green">Заказать</button>
                </div>
            </form>');