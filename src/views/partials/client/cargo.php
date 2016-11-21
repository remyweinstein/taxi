<?php
$json_data = array ('title' => 'Грузоперевозки',
            'content' => '
            <nav class="tabs">
                <ul>
                    <li data-tab="1" class="tab--active">Заказать</li>
                    <li data-tab="2">Свободное авто</li>
                    <li data-tab="3">Мои заказы</li>
                </ul>
            </nav>
            <div class="tabs__wrapper">
              <div class="tabs__viewport">
                <div data-tab-content="1" class="tabs_content">
                    <form action="" method="POST" class="form-order-city">
                        <div class="form-order-city__field order-city-from">
                            <i class="icon-right-circled form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input class="adress_from" type="text" name="from" value="" placeholder="Откуда"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-left-circled form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="from" value="" placeholder="Куда"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-rouble form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input class="input_only_digits" type="text" name="from" value="" placeholder="Стоимость"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-commerical-building form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="from" value="" placeholder="Примечание"/></span>
                        </div>
                        <div class="gBlock gBlock--float">
                            <button class="button_rounded--green">Заказать грузовое авто</button>
                        </div>
                    </form>
                </div>
                <div data-tab-content="2" class="tabs_content">
                <ul class="list-extended">
                    <li>
                        <div class="list-extended__personal">
                            <img src="../../images/no_avatar.png" alt="" />
                        </div>
                        <div class="list-extended__route">
                            <div class="list-extended__route_name">Борис</div>
                            <div class="list-extended__route_time">12:45</div>
                            <div class="list-extended__route_info">Грузоперевозки по городу</div>
                            <div class="list-extended__route_sum">500</div>
                        </div>
                        <div class="list-extended__phone">
                            <a href="#"><i class="icon-phone-circled"></i></a>
                        </div>
                    </li>
                </ul>
                </div>
                <div data-tab-content="3" class="tabs_content">
                <ul class="myorders">
                    <li>
                        <p class="myorders__item__time">Вчера, 23:19</p>
                        <p class="myorders__item__from">Ленина, 57</p>
                        <p class="myorders__item__to">Карла Маркса 108</p>
                        <p class="myorders__item__summa">150</p>
                        <p class="myorders__item__info">Рано утром</p>
                    </li>
                </ul>
                </div>
              </div>
            </div>
            ');
