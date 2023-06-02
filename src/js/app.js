let dadossService = JSON.parse(localStorage.getItem("dados"))

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

function groupBy(array, key) {
    return array.reduce((acc, item) => {
        if (!acc[item[key]]) acc[item[key]] = []
        acc[item[key]].push(item)
        return acc
    }, {})
}





// abrir e fechar menu
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


// Quantidade de Serviços 
var data = []

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
for (let i = 0; i < dados.length; i++) {
    monthServices += `${monthService((dados[i].DataHora_FINALIZADO).split("-")[1])},`
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

// MTTR
// soma das horas dos serviços corretivos, tirada a média e transformado em decimal
let mttrServices = [];
for (let i = 0; i < dados.length; i++) {
    mttrServices += `{"status":"${dados[i].ExternalTipoServicoName.split(" ")[dados[i].ExternalTipoServicoName.split(" ").length-1]}","horas":"${dados[i].Tempo_Total_de_Atendimento.split(":")[0]}"},`
}
let dataCorretiva = "[" + mttrServices + "]"
let dataMttr = dataCorretiva.replace(/},]/gi, '}]')
let jsonData = JSON.parse(dataMttr)
let filter = jsonData.filter(d => d.status == "Corretiva" && d.horas !== "NaN")
let mttr = 0;

for (const item of filter) {
    mttr += parseFloat(item.horas);
}

document.querySelector('.mttr_amount').innerHTML = Math.round(mttr / filter.length)




//Quantidade de serviço por status
let desp = dados.map(f => f.Status_DESPACHADO)
let acte = dados.map(f => f.Status_RECEBIDO)
let tacm = dados.map(f => f.Status_CAMINHO)
let inic = dados.map(f => f.Status_INICIAR)
let fiok1 = dados.map(f => f.Status_PAUSADO)
let fiok = dados.map(f => f.Status_FINALIZADO)


function removeUndefined(status) {
    let remove = status.filter(s => s !== "undefined");
    return remove
}

let status = `
    [{"status":"Despachado","amount":"${removeUndefined(desp).length}"},
    {"status":"Recebido","amount":"${removeUndefined(acte).length}"},
    {"status":"A Caminho","amount":"${removeUndefined(tacm).length}"},
    {"status":"Iniciado","amount":"${removeUndefined(inic).length}"},
    {"status":"Pausado","amount":"${removeUndefined(fiok1).length}"},
    {"status":"Finalzizado","amount":"${removeUndefined(fiok).length}"}]
    `
let statusdadoss = JSON.parse(status)
const chart__status = document.querySelector('.chart_status');
const labels__status = decrescente(statusdadoss).map(s => s.status)
const datas__status = decrescente(statusdadoss).map(n => n.amount)

// chartBars(chart__status, labels__status, datas__status)
const data_status = {
    labels: labels__status,
    datasets: [{
        data: datas__status,
        borderWidth: 1,
        backgroundColor: '#002670',
    }]
};
const config_status = {
    type: 'bar',
    data: data_status,
    plugins: [ChartDataLabels],
    options: {
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
            padding: 5,
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                anchor: 'end',
                aling: 'end',
                offset: 15,
                font: {
                    size: '15'
                },
                formatter: function(value, context) {
                    return context.chart.data[context.dataIndex];
                }
            },
        }
    },
};
let myChart_status = new Chart(
    chart__status,
    config_status
)

///////AQUI\\\\\\\\




// Quantidade de Serviços por Categoria
let categoryServices = [];
for (let i = 0; i < dados.length; i++) {
    categoryServices += `${dados[i].TipoServico+"¬"}`
}
let arrayCategory = categoryServices.split('¬')
let dataCategoryService = uniqItem(arrayCategory)
let dataServiceCategory = dataCategoryService.splice(0, dataCategoryService.length - 1)
const chart__category = document.querySelector('.chart_category');
const labels__category = decrescente(dataServiceCategory).map(s => s.status)
const datas__category = decrescente(dataServiceCategory).map(n => n.amount)
    // chartBars(chart__category, labels__category, datas__category)

const data_category = {
    labels: labels__category,
    datasets: [{
        data: datas__category,
        borderWidth: 1,
        backgroundColor: '#002670',
    }]
};
const config_category = {
    type: 'bar',
    data: data_category,
    plugins: [ChartDataLabels],
    options: {
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
            padding: 5,
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                anchor: 'end',
                aling: 'end',
                offset: 15,
                font: {
                    size: '15'
                },
                formatter: function(value, context) {
                    return context.chart.data[context.dataIndex];
                }
            },
        }
    },
};
let myChart_category = new Chart(
    chart__category,
    config_category
)


// Quantidade de Serviços por Classificação
let classServices = [];
for (let i = 0; i < dados.length; i++) {
    classServices += `${dados[i].ModoServico+"¬"}`
}

let arrayClass = classServices.split('¬')
let dataClassService = uniqItem(arrayClass)
let dataServiceClass = dataClassService.splice(0, dataClassService.length - 1)
console.log(dataServiceClass);
const chart__class = document.querySelector('.chart_classification');
const labels__class = decrescente(dataServiceClass).map(s => s.status)
const datas__class = decrescente(dataServiceClass).map(n => n.amount)
    // chartBars(chart__class, labels__class, datas__class)

const data_class = {
    labels: labels__class,
    datasets: [{
        data: datas__class,
        borderWidth: 1,
        backgroundColor: '#002670',
    }]
};
const config_class = {
    type: 'bar',
    data: data_class,
    plugins: [ChartDataLabels],
    options: {
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
            padding: 5,
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                anchor: 'end',
                aling: 'end',
                offset: 15,
                font: {
                    size: '15'
                },
                formatter: function(value, context) {
                    return context.chart.data[context.dataIndex];
                }
            },
        }
    },
};
let myChart_class = new Chart(
    chart__class,
    config_class
)

// Quantidade de Serviços por Tipo
let typeServices = [];
for (let i = 0; i < dados.length; i++) {
    typeServices += `${dados[i].ExternalTipoServicoName+"¬"}`
}
let arrayType = typeServices.split('¬')
let dataTypeService = uniqItem(arrayType)
let dataServiceType = dataTypeService.splice(0, dataTypeService.length - 1)
const chart__type = document.querySelector('.chart_type');
const labels__type = decrescente(dataServiceType).map(s => s.status)
const datas__type = decrescente(dataServiceType).map(n => n.amount)
    // chartBars(chart__type, labels__type, datas__type)

const data_type = {
    labels: labels__type,
    datasets: [{
        data: datas__type,
        borderWidth: 1,
        backgroundColor: '#002670',
    }]
};
const config_type = {
    type: 'bar',
    data: data_type,
    plugins: [ChartDataLabels],
    options: {
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: {
            padding: 5,
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                anchor: 'end',
                aling: 'end',
                offset: 15,
                font: {
                    size: '15'
                },
                formatter: function(value, context) {
                    return context.chart.data[context.dataIndex];
                }
            },
        }
    },
};
let myChart_type = new Chart(
    chart__type,
    config_type
)

// Quantidade de Serviços por Data
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

let monthDataServices = [];
for (let i = 0; i < dados.length; i++) {
    monthDataServices += `${monthService((dados[i].DataHora_FINALIZADO).split("-")[1])},`
}

let arrayDataMonths = monthDataServices.split(',')
let dataAmountServices = uniqItem(arrayDataMonths)

let modoDataServices = [];
for (let i = 0; i < dados.length; i++) {
    modoDataServices += `${retira_acentos(dados[i].ModoServico).replace(/ /gi,'_')},`
}

let arrayDataModo = modoDataServices.split(',')
let dataModoService = uniqItem(arrayDataModo)

let classService = [];
for (let i = 0; i < dados.length; i++) {
    classService += `{"status":"${retira_acentos(dados[i].ModoServico).replace(/ /gi,'_')}","mes":"${monthService((dados[i].DataHora_FINALIZADO).split("-")[1])}"},`
}
let jsonClassServices = JSON.parse("[" + classService.slice(0, -1) + "]")

function filtrar(status, mes) {
    return jsonClassServices.filter(el => el.status == dataModoService[status].status && el.mes == dataAmountServices[mes].status)
}

let servicesMonth = []
for (let i = 0; i < dataAmountServices.length; i++) {
    for (let x = 0; x < dataModoService.length; x++) {
        servicesMonth += `${JSON.stringify(filtrar(x,i)[0])}":"amount":"${filtrar(x,i).length}"}`
    }
}

let stringServicesMonth = "[" + servicesMonth.replace(/\}":/gi, ',').replace(/undefined":"amount":"0"}/gi, '').replace(/\}/gi, '},').slice(0, -1) + "]"
let jsonServicesMonth = JSON.parse(stringServicesMonth).filter(el => el.status !== "undefined")

let manutencao_corretiva = jsonServicesMonth.filter(el => el.status == "MANUTENCAO_CORRETIVA")
let implantacao = jsonServicesMonth.filter(el => el.status == "IMPLANTACAO")
let manutencao_preventiva = jsonServicesMonth.filter(el => el.status == "MANUTENCAO_PREVENTIVA")
let manutencao_predetiva = jsonServicesMonth.filter(el => el.status == "MANUTENCAO_PREDETIVA")
let servicos_internos = jsonServicesMonth.filter(el => el.status == "SERVICOS_INTERNOS")
let fora_da_empresa = jsonServicesMonth.filter(el => el.status == "FORA_DA_EMPRESA")

const chart = document.querySelector('.chart_services');

let datasetes = ` [{
    "label": ["${manutencao_corretiva.map(s => s.status)[0]}"],
    "data": [${manutencao_corretiva.map(s => s.amount)}],
    "borderColor": "#ff7b00",
    "backgroundColor":  "#ff7b00",
    "borderWidth": 1,
    "fill": 1
}, {
    "label": ["${implantacao.map(s => s.status)[0]}"],
    "data": [${implantacao.map(s => s.amount)}],
    "borderColor": "#40a3ff",
    "backgroundColor": "#40a3ff",
    "borderWidth": 1,
    "fill": 1
}, {
    "label": ["${manutencao_preventiva.map(s => s.status)[0]}"],
    "data": [${manutencao_preventiva.map(s => s.amount)}],
    "borderColor": "#ef1048",
    "backgroundColor":"#ef1048",
    "borderWidth": 1,
    "fill": 1
}, {
    "label":["${manutencao_predetiva.map(s => s.status)[0]}"],
    "data": [${manutencao_predetiva.map(s => s.amount)}],
    "borderColor": "#3228da",
    "backgroundColor": "#3228da",
    "borderWidth": 1,
    "fill": 1
}, {
    "label": ["${servicos_internos.map(s => s.status)[0]}"],
    "data":[${servicos_internos.map(s => s.amount)}],
    "borderColor": "#55d52a",
    "backgroundColor":"#55d52a",
    "borderWidth": 1,
    "fill": 1
}, {
    "label":["${fora_da_empresa.map(s => s.status)[0]}"],
    "data": [${fora_da_empresa.map(s => s.amount)}],
    "borderColor": "#00fffd",
    "backgroundColor": "#00fffd",
    "borderWidth": 1,
    "fill": 1
} ]
`
let label = dataAmountServices.map(s => s.status)

const datas = {
    labels: label.slice(0, label.length - 1),
    datasets: JSON.parse(datasetes).filter(el => el.status !== 'undefined')
};

// config 
const config = {
    type: 'line',
    data: datas,
    options: {
        scales: {
            y: {
                stacked: true,
                beginAtZero: true
            }
        }
    }
};

// render init block
const myChart = new Chart(
    chart,
    config
);

// lista de serviços

$(document).ready(function() {
    $('.table').DataTable({
        "language": {
            "lengthMenu": "_MENU_",
            "zeroRecords": "Nada encontrado",
            "info": "_PAGE_ de _PAGES_",
            "infoEmpty": "Nenhum registro disponível",
            "infoFiltered": "(filtrado de _MAX_ registros no total)"
        }
    });
});


let chart_list = []
for (let i = 0; i < dados.length; i++) {
    chart_list += `
            <tr data="${i}">
            <td scope="row" title="${dados[i].NumeroOS}">${dados[i].NumeroOS}</td>
            <td title="${dados[i].ExternalTipoServicoName}">${dados[i].ExternalTipoServicoName}</td>
            <td title="${new Date((dados[i].DataHora_DESPACHADO)).toLocaleString().replace(/,/,' ')}<">${new Date((dados[i].DataHora_DESPACHADO)).toLocaleString().replace(/,/,' ')}</td>
            <td title="${new Date((dados[i].DataHora_FINALIZADO)).toLocaleString().replace(/,/,' ')}">${new Date((dados[i].DataHora_FINALIZADO)).toLocaleString().replace(/,/,' ')}</td>
            <td title="${dados[i].Tempo_Total_de_Atendimento.split(":")[0]}"> ${dados[i].Tempo_Total_de_Atendimento.split(":")[0]} </td>
            <td title="${dados[i].ClientName}">${dados[i].ClientName}</td>
          </tr>
        `
}
document.querySelector(".chart__list").innerHTML = chart_list

//mapa
var map = L.map('chart_map').setView([dados[0].Latitude_FINALIZADO.replace(/\":"/gi, ''), dados[dados.length - 1].Longitude_FINALIZADO.replace(/\":"/gi, '')], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <span href="http://www.openstreetmap.org/copyright">OpenStreetMap</span>'
}).addTo(map);

// const layerControl = L.control.layers({
//     'Mapa': map,
// }, {});
// layerControl.addTo(map);

var jsonMap = [];
for (let i = 0; i < dados.length; i++) {
    jsonMap += `{"type": "Feature",
                "properties": {
                    "popupContent": "OS:${dados[i].NumeroOS}<br>Técnico: ${dados[i].MobileAgentName}<br>Cliente: ${dados[i].ClientName}"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [${(dados[i].Longitude_FINALIZADO).replace(/\":"/gi, '')+","+ (dados[i].Latitude_FINALIZADO).replace(/\":"/gi, '')}]
                }
            },`
}
let nova = jsonMap.slice(0, -1);
const pointToCircle = L.geoJSON(JSON.parse(`[${nova}]`), {
    pointToLayer: function(feature, latlng) {
        const {
            properties
        } = feature;
        const {
            popupContent
        } = properties;
        return L.circleMarker(latlng, {
            radius: 10,
            fillColor: '#002670',
            color: "#f00",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        }).bindPopup(
            `${popupContent}`
        ).openPopup();
    }
}).addTo(map)

//checbox list

let checboxNumeroOS = []
dados.forEach(i => {
    checboxNumeroOS += ` <div>
    <input type="checkbox" class="checkItem checkbox" id="${i.NumeroOS}" name="${i.NumeroOS}">
    <label for="${i.NumeroOS}">${i.NumeroOS}</label>
</div>`
});

let checboxTecnico = []
dados.forEach(i => {
    checboxTecnico += i.MobileAgentName + ','
});
let arraychecboxTecnico = checboxTecnico.split(',')

let checboxClient = []
dados.forEach(i => {
    checboxClient += i.ClientName + ','
});
let arrayChecboxClient = checboxClient.split(',')

let checboxSLA = []
dados.forEach(i => {
    checboxSLA += i.SLA + ','
});
let arrayChecboxSLA = checboxSLA.split(',')

function listCheckbox(list) {
    let listCheck = [];
    list.filter(el => el !== "undefined").forEach(element => {
        listCheck += ` <div class="div_checkbox">
        <input type="checkbox" class="checkItem checkbox" id="${element}" name="${element}">
        <label for="${element}">${element}</label>
    </div>`
    });
    return listCheck
}


const numeroOSID01 = document.getElementById("numeroOSID01")
numeroOSID01.innerHTML = checboxNumeroOS

const categoriaID01 = document.getElementById("categoriaID01")
categoriaID01.innerHTML = listCheckbox(labels__category)

const classificationID01 = document.getElementById("classificationID01")
classificationID01.innerHTML = listCheckbox(labels__class)

const typeID01 = document.getElementById("typeID01")
typeID01.innerHTML = listCheckbox(labels__type)

const statusID01 = document.getElementById("statusID01")
statusID01.innerHTML = listCheckbox(labels__status)

const tecnicoID01 = document.getElementById("tecnicoID01")
tecnicoID01.innerHTML = listCheckbox(arraychecboxTecnico)

const clientNameID01 = document.getElementById("clientNameID01")
clientNameID01.innerHTML = listCheckbox(arrayChecboxClient)

const slaID01 = document.getElementById("slaID01")
slaID01.innerHTML = listCheckbox(arrayChecboxSLA)

function filterChart() {
    function dados(dados) {

    }
}

filterChart()

function filterCategory(myChart, dataService) {
    let selectContent = document.querySelectorAll(".checkItem")
    let selectValues = []
    for (let i = 0; i < selectContent.length; i++) {
        selectValues += (selectContent[i].checked == true ? selectContent[i].name : selectContent[i].checked) + "¬"
    }
    let arraySelect = selectValues.toLowerCase().split("¬")
    let filterSelect = arraySelect.filter(f => f !== "false" && f !== "")
    console.log(filterSelect);
    let filter = []
    for (let i = 0; i < filterSelect.length; i++) {
        filter += JSON.stringify(dataService.filter(f => f.status.toLowerCase() === filterSelect[i])[0]) + ","
    }
    let filterCategory = filter.length == 0 ? dataService : JSON.parse(filter.replace(/.$/, ']').replace(/{"/, '[{"'))

    const labels__category = decrescente(filterCategory).map(s => s.status)
    const datas__category = decrescente(filterCategory).map(n => n.amount)
    myChart.data.labels = labels__category
    myChart.data.datasets[0].data = datas__category
    myChart.update();
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
    document.querySelectorAll('.checkItem')[valorItemSelect].checked = true
}

function filterCheckbox(searchs, items) {
    let search = searchs.value.toUpperCase();
    let item = items;
    let div_checkbox = item.querySelectorAll(".div_checkbox");
    for (i = 0; i < div_checkbox.length; i++) {
        let divs = div_checkbox[i];
        let txtValue = divs.textContent || divs.innerText;
        if (txtValue.toUpperCase().indexOf(search) > -1) {
            div_checkbox[i].style.display = "";
        } else {
            div_checkbox[i].style.display = "none";
        }
    }
}



document.getElementById("search_classification").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(event, search_classification);
        filterCategory(myChart_class, dataServiceClass)
    }

})

document.getElementById('search_classification').addEventListener("keyup", () => {
    filterCheckbox(search_classification, classificationID01)
})
document.getElementById('ico_search_classification').addEventListener("click", function(event) {
    selectCheckbox(event, search_classification);
})


document.getElementById("search_categoria").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(event, search_categoria);
        filterCategory(myChart_category, dataServiceCategory)
    }

})

document.getElementById('search_categoria').addEventListener("keyup", () => {
    filterCheckbox(search_categoria, categoriaID01)
})
document.getElementById('ico_search_categoria').addEventListener("click", function(event) {
    selectCheckbox(event, search_categoria);
})


document.getElementById("search_type").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(event, search_type);
        filterCategory(myChart_type, dataServiceType)
    }

})

document.getElementById('search_type').addEventListener("keyup", () => {
    filterCheckbox(search_type, typeID01)
})
document.getElementById('ico_search_type').addEventListener("click", function(event) {
    selectCheckbox(event, search_type);
})

document.getElementById("search_status").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(event, search_status);
        filterCategory(myChart_status, statusdados)
    }

})

document.getElementById('search_status').addEventListener("keyup", () => {
    filterCheckbox(search_status, statusID01)
})
document.getElementById('ico_search_status').addEventListener("click", function(event) {
    selectCheckbox(event, search_status);
})


let data__inicial = document.querySelector('.data__inicial')
data__inicial.value = dados[0].DataHora_FINALIZADO.split("T")[0]
let data__final = document.querySelector('.data__final')
data__final.value = dados[dados.length - 1].DataHora_FINALIZADO.split("T")[0]

function filterDdata() {
    return dados.filter(el => el.DataHora_FINALIZADO.split("T")[0] >= data__inicial.value && el.DataHora_FINALIZADO.split("T")[0] <= data__final.value)
}


data__inicial.addEventListener('change', () => {
    localStorage.setItem("dados", JSON.stringify(filterDdata()))
})

data__final.addEventListener('change', () => {
    localStorage.setItem("dados", JSON.stringify(filterDdata()))
})