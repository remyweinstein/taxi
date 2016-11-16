<?php
$json_data = array ('title' => 'Межгород',
            'content' => '
            <nav class="tabs">
                <ul>
                    <li data-tab="1" class="tab--active">Заказы</li>
                    <li data-tab="2">Свободное авто</li>
                    <li data-tab="3">Мои заказы</li>
                </ul>
            </nav>
            <div class="tabs__wrapper">
              <div class="tabs__viewport">
                <div data-tabcontent="1" data-tab-content="1" class="tabs_content" id="1">
                    <div class="filter-intercity">
                        <p>
                            <i class="icon-building"></i>
                            <input type="text" data-keyup="filter_intercity_from" name="filter_intercity_from" value="Хабаровск" />
                        </p>
                        <p>
                            <i class="icon-building"></i>
                            <input type="text" data-keyup="filter_intercity_to" name="filter_intercity_to" value="" placeholder="Город, куда направляетесь" />
                        </p>
                    </div>
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
                        </li>
                    </ul>
                </div>
                <div data-tabcontent="2" data-tab-content="2" class="tabs_content">
                    <div class="filter-intercity">
                        <p>
                            <i class="icon-building"></i>
                            <input type="text" class="filter_intercity_from" name="filter_intercity_from" value="Хабаровск" />
                        </p>
                        <p>
                            <i class="icon-building"></i>
                            <input type="text" class="filter_intercity_to" name="filter_intercity_to" value="" placeholder="Город, куда направляетесь" />
                        </p>
                    </div>
                    <ul class="list-extended">
                        <li>
                            <div class="list-extended__personal">
                                <img src="../../images/no_avatar.png" alt="" />
                            </div>
                            <div class="list-extended__route">
                                <div class="list-extended__route_name">Петр</div>
                                <div class="list-extended__route_time">2 октября,16:17</div>
                                <div class="list-extended__route_from">Хабаровск</div>
                                <div class="list-extended__route_to">Магадан</div>
                                <div class="list-extended__route_sum">7000</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div data-tabcontent="3" data-tab-content="3" class="tabs_content">
                    <ul class="list-extended">
                        <li>
                            <div class="list-extended__personal">
                                <img src="../../images/no_avatar.png" alt="" />
                            </div>
                            <div class="list-extended__route">
                                <div class="list-extended__route_name">Василий</div>
                                <div class="list-extended__route_time">2 ноября,19:35</div>
                                <div class="list-extended__route_from">Хабаровск</div>
                                <div class="list-extended__route_to">Лесозадск</div>
                                <div class="list-extended__route_sum">1000</div>
                                <div class="list-extended__route_info">Один русский)</div>
                            </div>
                        </li>
                    </ul>
                </div>    
              </div>    
            </div>    
    ');
