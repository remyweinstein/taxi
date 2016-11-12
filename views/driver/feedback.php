<?php
$json_data = array ('title' => 'Обратная связь',
            'content' => '
            <nav class="tabs">
                <ul>
                    <li data-tab="1" class="tab--active">Пожаловаться</li>
                    <li data-tab="2">Мои жалобы</li>
                </ul>
            </nav>
            <div class="tabs__wrapper">
              <div class="tabs__viewport">
                <div data-tab-content="1" class="tabs_content">
                    <h1>Обратная связь</h1>
                    <p>Здесь вы можете пожаловаться на действия других участников сервиса.</p>
                    <p>Пожалуйста, опишите максимально подробно вашу ситуацию.</p>
                    <form action="" method="POST" class="form-feedback" >
                        <p><input type="text" name="second-phone" value="" placeholder="Телефон второго лица" /></p>
                        <p>
                            <select name="reason">
                                <option value="1">Укажите причину</option>
                                <option value="2">Пассажир не вышел на заказ (Укажите заказ)</option>
                                <option value="3">Пассажир не оплатил за проезд (Укажите заказ)</option>
                                <option value="4">Конфликт с пассажиром (Напишите подробно)</option>
                                <option value="5">Пассажир забыл вещи в машине</option>
                                <option value="6">Проблемы с приложением</option>
                                <option value="7">Неполное описание заказа</option>
                                <option value="8">Другое</option>
                            </select>
                        </p>
                        <p>
                            <textarea name="message" placeholder="Сообщение"></textarea>
                        </p>
                        <p><input type="text" value="WIFI" name="wifi" /></p>
                        <p>Если у вас есть предложения по улучшению приложения просим написать на почту.</p>
                        <div class="gBlock">
                            <p><button class="button_wide--yellow">Отправить</button></p>
                        </div>
                    </form>
                </div>
                <div data-tab-content="2" class="tabs_content">
                    <h1>Мои заявки</h1>
                    <p>Нет результатов</p>
                </div>
              </div>
            </div>
            ');
