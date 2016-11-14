<?php
$json_data = array ('title' => 'Опции авто',
            'content' => '
                <form class="jq_form-edit-auto-cog form-edit-auto-cog" action="" method="POST">
                <p>Опции авто</p>
                <p>Есть кондиционер: <input type="radio" name="conditioner" value="0" checked /> Нет <input type="radio" name="conditioner" value="1" />Да</p>
                <p>Тип авто: 
                <select name="type">
                    <option value="Легковой">Легковой</option>
                    <option value="Микроавтобус">Микроавтобус</option>
                    <option value="Грузовик">Грузовик</option>
                </select></p>
                <p><button class="button_wide--yellow">Сохранить</button></p>
            </form>');