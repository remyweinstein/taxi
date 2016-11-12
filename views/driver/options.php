<?php
$json_data = array ('title' => 'Опции авто',
            'content' => '
                <form action="" method="POST">
                <p>Опции авто</p>
                <p>Есть кондиционер: <input type="radio" name="condition" value="no" checked /> Нет <input type="radio" name="condition" value="yes" />Да</p>
                <p>Тип авто: 
                <select name="type_auto">
                    <option>Легковой </option>
                    <option>Микроавтобус</option>
                    <option>Грузовик</option>
                </select></p>
                <p><button class="button_wide--yellow" onclick="submit();">Сохранить</button></p>
            </form>');