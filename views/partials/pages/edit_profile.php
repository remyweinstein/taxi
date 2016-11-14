<?php
$json_data = array ('title' => 'Редактирование',
            'content' => '
                <form class="jq_form-edit-profile form-edit-profile" action="" method="post" enctype="multipart/form-data">
                    <p>
                        <img class="avatar" src="" alt="" style="width: 100px; height: 100px; background-color: grey;" />
                        <input type="file" name="ava_file" />
                        </p>
                    <p><input type="text" name="name" value="" /></p>
                    <p><input type="text" class="input_only_date" name="dob" value="" placeholder="дд.мм.ГГГГ" /></p>
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
                </form>
    ');


