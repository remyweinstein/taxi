<?php
$json_data = array ('title' => 'Вход',
            'content' => '
                <form data-submit="form-auth" data-controller="pages_login" onsubmit="return false;" class="form-login" action="" method="post">
                    <p>Введите ваш номер телефона для входа</p>
                    <p>+7<input type="text" data-keypress="input_only_digits" name="phone" placeholder="Ваш номер телефона" /></p>
                    <p><button class="button_rounded--green" data-click="form-submit">Далее</button></p>
                </form>
    ',
    'pageType' => 'back-arrow');


