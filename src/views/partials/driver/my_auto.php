<?php
$json_data = array ('title' => 'Мой авто',
            'content' => '
                <form data-controller="form-edit-auto" data-submit="form-edit-auto" onsubmit="return false;" class="form-edit-auto" action="" method="post">
                    <p>
                        <label>Марка:
                            <select name="brand">
                                <option value="0">Марка автомобиля</option>
                                <option value="Acura">Acura</option>
                                <option value="Alfa Romeo">Alfa Romeo</option>
                                <option value="Alpina">Alpina</option>
                                <option value="Aro">Aro</option>
                                <option value="Asia">Asia</option>
                                <option value="Aston Martin">Aston Martin</option>
                                <option value="Audi">Audi</option>
                                <option value="Austin">Austin</option>
                                <option value="Bentley">Bentley</option>
                                <option value="BMW">BMW</option>
                                <option value="Brilliance">Brilliance</option>
                                <option value="Bugatti">Bugatti</option>
                                <option value="Buick">Buick</option>
                                <option value="BYD">BYD</option>
                                <option value="Cadillac">Cadillac</option>
                                <option value="Caterham">Caterham</option>
                                <option value="ChangFeng">ChangFeng</option>
                                <option value="Chery">Chery</option>
                                <option value="Chevrolet">Chevrolet</option>
                                <option value="Chrysler">Chrysler</option>
                                <option value="Citroen">Citroen</option>
                                <option value="Coggiola">Coggiola</option>
                                <option value="Dacia">Dacia</option>
                                <option value="Dadi">Dadi</option>
                                <option value="Daewoo">Daewoo</option>
                                <option value="Daihatsu">Daihatsu</option>
                                <option value="Daimler">Daimler</option>
                                <option value="Derways">Derways</option>
                                <option value="Dodge">Dodge</option>
                                <option value="Dong Feng">Dong Feng</option>
                                <option value="Doninvest">Doninvest</option>
                                <option value="Donkervoort">Donkervoort</option>
                                <option value="Eagle">Eagle</option>
                                <option value="FAW">FAW</option>
                                <option value="Ferrari">Ferrari</option>
                                <option value="Fiat">Fiat</option>
                                <option value="Ford">Ford</option>
                                <option value="Geely">Geely</option>
                                <option value="Geo">Geo</option>
                                <option value="GMC">GMC</option>
                                <option value="Great Wall">Great Wall</option>
                                <option value="Hafei">Hafei</option>
                                <option value="Honda">Honda</option>
                                <option value="HuangHai">HuangHai</option>
                                <option value="Hummer">Hummer</option>
                                <option value="Hyundai">Hyundai</option>
                                <option value="Infiniti">Infiniti</option>
                                <option value="Iran Khodro">Iran Khodro</option>
                                <option value="Isuzu">Isuzu</option>
                                <option value="JAC">JAC</option>
                                <option value="Jaguar">Jaguar</option>
                                <option value="Jeep">Jeep</option>
                                <option value="Kia">Kia</option>
                                <option value="Koenigsegg">Koenigsegg</option>
                                <option value="Lamborghini">Lamborghini</option>
                                <option value="Lancia">Lancia</option>
                                <option value="Land Rover">Land Rover</option>
                                <option value="Landwind">Landwind</option>
                                <option value="Lexus">Lexus</option>
                                <option value="Lifan">Lifan</option>
                                <option value="Lincoln">Lincoln</option>
                                <option value="Lotus">Lotus</option>
                                <option value="Mahindra">Mahindra</option>
                                <option value="Maruti">Maruti</option>
                                <option value="Maserati">Maserati</option>
                                <option value="Maybach">Maybach</option>
                                <option value="Mazda">Mazda</option>
                                <option value="Mercedes-Benz">Mercedes-Benz</option>
                                <option value="Mercury">Mercury</option>
                                <option value="Metrocab">Metrocab</option>
                                <option value="MG">MG</option>
                                <option value="Microcar">Microcar</option>
                                <option value="Mini">Mini</option>
                                <option value="Mitsubishi">Mitsubishi</option>
                                <option value="Mitsuoka">Mitsuoka</option>
                                <option value="Morgan">Morgan</option>
                                <option value="Nissan">Nissan</option>
                                <option value="Oldsmobile">Oldsmobile</option>
                                <option value="Opel">Opel</option>
                                <option value="Pagani">Pagani</option>
                                <option value="Peugeot">Peugeot</option>
                                <option value="Plymouth">Plymouth</option>
                                <option value="Pontiac">Pontiac</option>
                                <option value="Porsche">Porsche</option>
                                <option value="Proton">Proton</option>
                                <option value="PUCH">PUCH</option>
                                <option value="Renault">Renault</option>
                                <option value="Rolls-Royce">Rolls-Royce</option>
                                <option value="Rover">Rover</option>
                                <option value="Saab">Saab</option>
                                <option value="Saleen">Saleen</option>
                                <option value="Saturn">Saturn</option>
                                <option value="Scion">Scion</option>
                                <option value="SEAT">SEAT</option>
                                <option value="ShuangHuan">ShuangHuan</option>
                                <option value="Skoda">Skoda</option>
                                <option value="Smart">Smart</option>
                                <option value="Spyker">Spyker</option>
                                <option value="SsangYong">SsangYong</option>
                                <option value="Subaru">Subaru</option>
                                <option value="Suzuki">Suzuki</option>
                                <option value="Tatra">Tatra</option>
                                <option value="Tianma">Tianma</option>
                                <option value="Tianye">Tianye</option>
                                <option value="Toyota">Toyota</option>
                                <option value="Trabant">Trabant</option>
                                <option value="TVR">TVR</option>
                                <option value="Vector">Vector</option>
                                <option value="Volkswagen">Volkswagen</option>
                                <option value="Volvo">Volvo</option>
                                <option value="Wartburg">Wartburg</option>
                                <option value="Wiesmann">Wiesmann</option>
                                <option value="Xin Kai">Xin Kai</option>
                                <option value="ZX">ZX</option>
                                <option value="ВАЗ">ВАЗ</option>
                                <option value="Велта">Велта</option>
                                <option value="ГАЗ">ГАЗ</option>
                                <option value="ЗАЗ">ЗАЗ</option>
                                <option value="ЗИЛ">ЗИЛ</option>
                                <option value="ИЖ">ИЖ</option>
                                <option value="КАМАЗ">КАМАЗ</option>
                                <option value="ЛУАЗ">ЛУАЗ</option>
                                <option value="Москвич">Москвич</option>
                                <option value="СеАЗ">СеАЗ</option>
                                <option value="СМЗ">СМЗ</option>
                                <option value="ТагАЗ">ТагАЗ</option>
                                <option value="УАЗ">УАЗ</option>
                            </select>
                        </label>
                    </p>
                    <p>
                        <label>Модель:
                            <input type="text" name="model" value="" placeholder="Модель автомобиля" />
                        </label>
                    </p>
                    <p>
                        <label>Цвет авто:
                            <input type="text" name="color" value="" placeholder="Цвет авто" />
                        </label>
                    </p>
                    <p>
                        <label>Гос номер:
                            <input type="text" name="number" value="" placeholder="Гос. Номер" />
                        </label>
                    </p>
                    <p>
                        <label>Доп. инфо:
                            <input type="text" name="tonnage" value="" placeholder="Доп. инфо грузового авто"/>
                        </label>
                    </p>
                    <p>
                        Есть кондиционер: <input type="radio" name="conditioner" value="0" checked /> Нет <input type="radio" name="conditioner" value="1" />Да
                    </p>
                    <p>
                        <label>Тип авто: 
                            <select name="type">
                                <option value="Легковой">Легковой</option>
                                <option value="Микроавтобус">Микроавтобус</option>
                                <option value="Грузовик">Грузовик</option>
                            </select>
                        </label>
                    </p>
                    <p>
                        <button class="button_wide--yellow">Сохранить</button>
                    </p>
                </form>',
                'pageType' => 'back-arrow');