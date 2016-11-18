<?php
$json_data = array ('title' => 'Редактирование',
            'content' => '
                <form data-submit="form-edit-profile" class="form-edit-profile" action="" onsubmit="return false;" method="post" enctype="multipart/form-data">
                    <p>
                        <img class="avatar" src="" alt="" />
                        <input type="file" name="ava_file" /><br/>
                        <a href="#" data-click="clear_photo">удалить</a>
                        </p>
                    <p><input type="text" name="myname" value="" /></p>
                    <p><input type="text" data-keypress="input_only_date" name="dob" value="" placeholder="дд.мм.ГГГГ" /></p>
                    <p>
                        <select name="sex">
                            <option value="1">Мужской</option>
                            <option value="0">Женский</option>
                        </select>
                    </p>
                    <p>
                        <select name="city">
                            <option value="Хабаровск">Хабаровск</option>
                            <option value="Владивосток">Владивосток</option>
                            <option value="Комсомольск-на-Амуре">Комсомольск-на-Амуре</option>
                            <option value="Москва">Москва</option>
                        </select>
                    </p>
                    <p><button class="button_rounded--green">Сохранить</button></p>
                </form>',
    'pageType' => 'back-arrow'
    );


