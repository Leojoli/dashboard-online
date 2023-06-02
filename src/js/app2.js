var decrescente = function(j) {
    var arr = [];
    for (var key in j) {
        arr.push(j[key]);
    }
    arr.sort(function(a, b) {
        var intA = parseInt(a.amount),
            intB = parseInt(b.amount);
        if (intA > intB)
            return -1;
        if (intA < intB)
            return 1;
        return 0;
    });
    return arr;
};

function retira_acentos(str) {
    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr = "";
    for (i = 0; i < str.length; i++) {
        troca = false;
        for (a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
}

document.querySelector('.open').addEventListener('click', () => {
    document.querySelector('.navbar').style.width = "50vh";
    document.querySelector('.open').style.display = "none"
})
document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.navbar').style.width = "0";
    document.querySelector('.open').style.display = "block"
})
document.body.addEventListener('keypress', function(event) {
    if (event.key == "Escape") {
        document.querySelector('.navbar').style.width = "0";
        document.querySelector('.open').style.display = "block"
    }
})


let servicos = dados

function uniqItem(array) {
    function itemServices(c) {
        let cNumber = array.filter(f => f == c).length
        return cNumber
    }

    const uniqItem = array.filter((item, index, self) => self.indexOf(item) === index)
    let itemServicesText = [];
    for (let i = 0; i < uniqItem.length; i++) {
        itemServicesText += `{"status":"${uniqItem[i]}", "amount":"${itemServices(uniqItem[i])}"},`
    }
    data = JSON.parse(`[${itemServicesText.slice(0, -1)}]`)
    return data
}

function monthService(number) {
    let filter = month.filter(f => f.number == number)
    let monthes = filter[0].month
    return monthes
}

let monthServices = [];
for (let i = 0; i < servicos.length; i++) {
    monthServices += `${monthService((servicos[i].DataHora_FINALIZADO).split("-")[1])},`
}

let arrayMonth = monthServices.split(',')

let dataAmountService = uniqItem(arrayMonth)
let dataService = dataAmountService.splice(0, dataAmountService.length - 1)

const chart__amount = document.querySelector('.chart__amount');
const labels__amount = dataService.map(s => s.status)
const datas__amount = dataService.map(n => n.amount)

const data_amount = {
    labels: labels__amount,
    datasets: [{
        data: datas__amount,
        backgroundColor: "#fff",
        color: "#fff"
    }],
}

const config__amount = {
    type: 'line',
    data: data_amount,
    plugins: [ChartDataLabels],
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: 5,
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                fill: false,
                color: "#fff",
                tension: 0.1,
                font: {
                    size: '20'
                },
                formatter: function(value, context) {
                    return context.chart.data[context.dataIndex];
                }
            }
        },
    },
};
let myChart__amount = new Chart(
    chart__amount,
    config__amount
)

let checboxNumeroOS = []
dados.forEach(i => {
    checboxNumeroOS += `<div class="div_checkbox">
    <input type="checkbox" class="checkItem checkbox" id="${i.NumeroOS}" name="${i.NumeroOS}">
    <label for="${i.NumeroOS}">${i.NumeroOS}</label>
</div>`
});

const numeroOSID01 = document.getElementById("numeroOSID01")
numeroOSID01.innerHTML = checboxNumeroOS

function filterCategory() {
    console.log(servicos);
    let selectContent = document.querySelectorAll(".checkItem")
    let selectValues = []
    for (let i = 0; i < selectContent.length; i++) {
        selectValues += (selectContent[i].checked == true ? selectContent[i].name : selectContent[i].checked) + "¬"
    }
    let arraySelect = selectValues.toLowerCase().split("¬")
    let filterSelect = arraySelect.filter(f => f !== "false" && f !== "")
    console.log(filterSelect[0]);

    let filter = []
    for (let i = 0; i < filterSelect.length; i++) {
        filter += JSON.stringify(servicos.filter(f => f.NumeroOS == filterSelect[i])).replace(/\[/gi, '').replace(/\}]/gi, '},')
    }
    let filterCategory = filter.length == 0 ? servicos : JSON.parse(filter.replace(/.$/, ']').replace(/{"/, '[{"'))
    console.log(filterCategory);


    let monthServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        monthServices += `${monthService((filterCategory[i].DataHora_FINALIZADO).split("-")[1])},`
    }

    let arrayMonth = monthServices.split(',')

    let dataAmountService = uniqItem(arrayMonth)
    let dataService = dataAmountService.splice(0, dataAmountService.length - 1)
    console.log(dataService);

    const chart__category = document.querySelector('#chart_category');
    const labels__category = decrescente(dataService).map(s => s.status)
    const datas__category = decrescente(dataService).map(n => n.amount)
    console.log(datas__category);

    myChart__amount.data.labels = labels__category
    myChart__amount.data.datasets[0].data = datas__category
    myChart__amount.update();
}

function selectCheckbox(event, search) {
    event.preventDefault();
    let selectContent = document.querySelectorAll(".checkItem")
    let selectValues = []
    for (let i = 0; i < selectContent.length; i++) {
        selectValues += selectContent[i].name + "¬"
    }
    let arraySelect = selectValues.toLowerCase().split("¬")
    let selectKey = search.value
    let filterSelect = arraySelect.filter(f => f.includes(selectKey.toLowerCase()))
    selectContent.value = filterSelect
    let valorItemSelect = arraySelect.indexOf(filterSelect[0])
    selectContent[valorItemSelect].checked = true
}

function filterCheckbox(searchs, items) {
    let search = searchs.value.toUpperCase();
    let item = items;
    let div_checkbox = item.querySelectorAll(".div_checkbox");
    for (i = 0; i < div_checkbox.length; i++) {
        let divs = div_checkbox[i];
        0
        let txtValue = divs.textContent || divs.innerText;
        if (txtValue.toUpperCase().indexOf(search) > -1) {
            div_checkbox[i].style.display = "";
        } else {
            div_checkbox[i].style.display = "none";
        }
    }
}

document.getElementById("search_numeroOS").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(event, search_numeroOS);
        filterCategory()
    }
})

document.getElementById('search_numeroOS').addEventListener("keyup", () => {
    filterCheckbox(search_numeroOS, numeroOSID01)
})

let activiesCaterory = document.querySelector("#numeroOSID01")
activiesCaterory.addEventListener("change", () => {
    filterCategory()
})
activiesCaterory.addEventListener("click", () => {
    filterCategory()
})