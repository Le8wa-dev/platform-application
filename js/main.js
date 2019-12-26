document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const customer = document.getElementById('customer'), // кнопка заказчик
        freelancer = document.getElementById('freelancer'), // кнопка фрилансер
        blockCustomer = document.getElementById('block-customer'), // блок заказчика
        blockFreelancer = document.getElementById('block-freelancer'), // блок фрилансера
        blockChoise = document.getElementById('block-choice'), // блок стартовый
        btnExit = document.getElementById('btn-exit'), // кнопка выхода с страниц заказчика и фрилансера
        formCustomer = document.getElementById('form-customer'), // форма заказчика
        ordersTable = document.getElementById('orders'), // таблица с заказами фрилансера
        modalOrder = document.getElementById('order_read'), // модальное окно заказа
        modalOrderActive = document.getElementById('order_active'), // модальное окно принятого заказа
        headTable = document.getElementById('headTable'); // заголовки таблицы фрилансера

    const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

// *** Функции

// функция отправки данных в LocalStorage
const toStorage = () => {
    localStorage.setItem('freeOrders', JSON.stringify(orders));
};

// функция склонения числительных
const declOfNum = (number, titles) => number + ' ' + titles[(number%100>4 && number%100<20)
    ? 2 
    : [2, 0, 1, 1, 1, 2][(number%10<5)?number%10:5]];  
// функция вычисления оставшихся дней до дедлайна
const calcDeadline = (deadlineDate) => {
    const deadline = new Date(deadlineDate);
    const currentDate = Date.now();
    const remaining = (deadline - currentDate)/(1000*60*60);
    // проверяем значение оставшегося времени на выполнение заказа > 2 дней
    if((remaining / 24) > 2) {
        return declOfNum(Math.floor(remaining / 24), ['день', 'дня', 'дней']);
    };

    return declOfNum(Math.floor(remaining), ['час', 'часа', 'часов']);
};

//занесение заказа в таблицу фрилансера
    const renderOrders = () => {
        // при каждом новом заходе на страницу фрилансера обнуляем таблицу
        ordersTable.textContent = '';
        //заносим в таблицу фрилансера каждый наш заказ из массива orders
        orders.forEach((order, i) => {
            ordersTable.innerHTML += `
                <tr class="order ${order.active ? 'taken' : ''}" 
                    data-number-order="${i}">
                    <td>${i + 1}</td>
                    <td>${order.title}</td>
                    <td class="${order.currency}"></td>
                    <td>${calcDeadline(order.deadline)}</td>
                </tr>`;
        });
    };

// закрытие модальных окон
    const handlerModal = (event) => {
        const target = event.target,
            modal = target.closest('.order-modal'),
            order = orders[modal.numberOrder];

        const baseAction = () => {
            modal.style.display = 'none';
            toStorage();
            renderOrders();
        };
        // закрываем модальное окно при клике на всю кнопку(с крестиком внутри) или оверлэй
        (target === modal || target.closest('.close'))
            ? modal.style.display = 'none'
            : '';
        // проверяем клик по кнопке Взять заказ и делаем заказ активным
        if (target.classList.contains('get-order')){
            order.active = true;
            baseAction();
        };
        // проверяем клик по кнопке Отказаться заказ и делаем заказ неактивным
        if (target.id === 'capitulation'){
            order.active = false;
            baseAction();
        };
        // проверяем клик по кнопке Выполнил заказ и удаляем заказ order из массива orders
        if (target.id === 'ready'){
            orders.splice(orders.indexOf(order), 1)
            baseAction();
        };

    };

// открытие модальных окон
    const openModal = (numberOrder) => {
        const order = orders[numberOrder];
        // получаем переменные и их значения путем деструктуризации объекта order
        const { title, firstName, email, phone, description,
            amount, currency, deadline, active = false } = order;
        // в зависимости от значения active в modal заносится свое окно из HTML
        const modal = active ? modalOrderActive : modalOrder;

        // получаем поля вызванного модального окна
        const titleBlock = modal.querySelector('.modal-title'),
            firstNameBlock = modal.querySelector('.firstName'),     
            emailBlock = modal.querySelector('.email'),    
            descriptionBlock = modal.querySelector('.description'),    
            deadlineBlock = modal.querySelector('.deadline'),    
            currencyBlock = modal.querySelector('.currency_img'),   
            countBlock = modal.querySelector('.count'),  
            phoneBlock = modal.querySelector('.phone');

        //наполняем поля модального окна  
        modal.numberOrder = numberOrder; 
        titleBlock.textContent = title;
        firstNameBlock.textContent = firstName;
        emailBlock.textContent = email;
        emailBlock.href = 'mailto:' + email;
        descriptionBlock.textContent = description;
        deadlineBlock.textContent = calcDeadline(deadline);
        currencyBlock.className = 'currency_img'
        currencyBlock.classList.add(currency);
        countBlock.textContent = amount;
        // проверяем есть ли в модальном окне элемент
        phoneBlock ? phoneBlock.href = 'tel:' + phone : '';
        // отображаем модальное окно
        modal.style.display = 'flex';
        // реализуем закрытие модального окна
        modal.addEventListener('click', handlerModal);
    };

    // функция сортировки в талице фрилансера
    const sortOrder = (arr, property) => {
        // arr - массив с заказами
        // property - свойство по которому сравниваем
        // a, b - объекты текущего заказа из общего массива
        arr.sort((a, b) => a[property] > b[property] ? 1 : -1);
    };

// *** Обработчики

    customer.addEventListener('click', () => {
        blockChoise.style.display = 'none';
        // полчим текущую дату и возьмем первые 10 символов
        const today = new Date().toISOString().substring(0,10);
        //установим значение атрибута min дедлайна не ранее текущей даты
        document.getElementById('deadline').min = today;

        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancer.addEventListener('click', () => {
        blockChoise.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    btnExit.addEventListener('click', () => {
        btnExit.style.display = 'none';
        blockCustomer.style.display = 'none';
        blockFreelancer.style.display = 'none';
        blockChoise.style.display = 'block';
    });
        
    formCustomer.addEventListener('submit', event => {
        event.preventDefault();
        // в obj будем заносить введенные значения формы заказчика
        const obj = {};

        const elements = [...formCustomer.elements]
        .filter(elem => (elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                        (elem.type === 'radio' && elem.checked) ||
                        (elem.tagName === 'TEXTAREA'));

        elements.forEach(elem => {
                obj[elem.name] = elem.value;

        });
        // сбрасываем поля формы заказчика
        formCustomer.reset()
        // заносим в массив всех заказов orders данные текущего заказа в виде obj
        orders.push(obj);
        // сохраняем в локалСторэдж
        toStorage();
    });

    headTable.addEventListener('click', event => {
        const target = event.target;

        if(target.classList.contains('head-sort')) {
            if(target.id === 'taskSort') {
                sortOrder(orders, 'title');
            } else
            if(target.id === 'currencySort') {
                sortOrder(orders, 'currency');
            } else
            if(target.id === 'deadlineSort') {
                sortOrder(orders, 'deadline');
            };
            toStorage();
            renderOrders();
        };
    });

    ordersTable.addEventListener('click', event => {
        const target = event.target,
            targetOrders = target.closest('.order');

        if(targetOrders) {
            openModal(targetOrders.dataset.numberOrder)
        }
    });

});