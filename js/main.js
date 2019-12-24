'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const customer = document.getElementById('customer'),
        freelancer = document.getElementById('freelancer'),
        blockCustomer = document.getElementById('block-customer'),
        blockFreelancer = document.getElementById('block-freelancer'),
        blockChoise = document.getElementById('block-choice'),
        btnExit = document.getElementById('btn-exit'),
        formCustomer = document.getElementById('form-customer');

    const orders = []

        customer.addEventListener('click', (e) => {
            blockChoise.style.display = 'none';
            blockCustomer.style.display = 'block';
            btnExit.style.display = 'block';
        });

        freelancer.addEventListener('click', (e) => {
            blockChoise.style.display = 'none';
            blockFreelancer.style.display = 'block';
            btnExit.style.display = 'block';
        });

        btnExit.addEventListener('click', () => {
            btnExit.style.display = 'none';
            blockCustomer.style.display = 'none';
            blockFreelancer.style.display = 'none';
            blockChoise.style.display = 'block';
        });
        
        formCustomer.addEventListener('submit', e => {
            e.preventDefault();
            const obj = {};
            for (const elem of formCustomer.elements) {
                if((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')) {
                    obj[elem.name] = elem.value;

                    if(elem.type !== 'radio') {
                        elem.value = ''
                    }
                }
            }
            orders.push(obj);
        });
})