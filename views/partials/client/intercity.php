<?php
$json_data = array ('title' => 'Межгород',
            'content' => '<nav class="tabs">
                <ul>
                    <li data-tab="1" class="tab--active">Заказать</li>
                    <li data-tab="2">Попутки</li>
                    <li data-tab="3">Мои заказы</li>
                </ul>
            </nav>
            <div class="tabs__wrapper">
              <div class="tabs__viewport">
                <div data-tab-content="1" class="tabs_content">
                    <form action="" method="POST" class="form-order-city">
                        <div class="form-order-city__label_field">
                        ОТКУДА
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-commerical-building form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="city_from" value="Хабаровск" placeholder=""/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-left-circled form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="adress_from" value="" placeholder="Адрес"/></span>
                        </div>
                        <div class="form-order-city__label_field">
                        КУДА
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-commerical-building form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="city_to" value="" placeholder="Город, куда направляетесь"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-left-circled form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="adress_to" value="" placeholder="Адрес"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-rouble form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input class="input_only_digits" type="text" name="cost" value="" placeholder="Стоимость"/></span>
                        </div>
                        <div class="form-order-city__field">
                            <i class="icon-commerical-building form-order-city__label"></i>
                            <span class="form-order-city__wrap"><input type="text" name="from" value="" placeholder="Примечания"/></span>
                        </div>
                        <div class="gBlock">
                            <button class="button_rounded--green">Заказать</button>
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
                                <div class="list-extended__route_from">Хабаровск</div>
                                <div class="list-extended__route_to">Владивосток</div>
                                <div class="list-extended__route_sum">100 руб.</div>
                                <div class="list-extended__route_info">Два места</div>
                            </div>
                            <div class="list-extended__phone">
                                <a href="#"><i class="icon-phone-circled"></i></a>
                            </div>
                        </li>
                        <li>
                            <div class="list-extended__personal">
                                <img src="../../images/no_avatar.png" alt="" />
                            </div>
                            <div class="list-extended__route">
                                <div class="list-extended__route_name">Гульнара</div>
                                <div class="list-extended__route_time">16:37</div>
                                <div class="list-extended__route_from">Хабаровск</div>
                                <div class="list-extended__route_to">Благовещенск</div>
                                <div class="list-extended__route_info">Два места</div>
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
                            <p class="myorders__time">Вчера, 23:19</p>
                            <p class="myorders__from">Хабаровск</p>
                            <p class="myorders__to">Владивосток</p>
                            <p class="myorders__summa">150</p>
                            <p class="myorders__info">Рано утром</p>
                        </li>
                        <li>
                            <p class="myorders__time">Сегодня, 23:19</p>
                            <p class="myorders__from">Владивосток</p>
                            <p class="myorders__to">Хабаровск</p>
                            <p class="myorders__summa">150</p>
                            <p class="myorders__info">Поздно вечером</p>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
            ');