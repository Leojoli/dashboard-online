
function itemSelecionadoNumeroOS() {    
    let selectContentNumeroOS = document.querySelectorAll(".checkItemNumeroOS")
    let selectValuesNumeroOS = []
    for (let i = 0; i < selectContentNumeroOS.length; i++) {
        selectValuesNumeroOS += (selectContentNumeroOS[i].checked == true ? selectContentNumeroOS[i].name : selectContentNumeroOS[i].checked) + "¬"
    }
    
    let arraySelectNumeroOS = selectValuesNumeroOS.toLowerCase().split("¬")
    let filterSelectNumeroOS = arraySelectNumeroOS.filter(f => f !== "false" && f !== "")
    localStorage.setItem("dados", JSON.stringify(dados))
let getService = localStorage.getItem("dados")
    let servicosNumeroOS = JSON.parse(getService)

    let filterNumeroOS = []
    for (let i = 0; i < filterSelectNumeroOS.length; i++) {
        filterNumeroOS += JSON.stringify(servicosNumeroOS.filter(f => f.NumeroOS == filterSelectNumeroOS[i])).replace(/\[/gi, '').replace(/\}]/gi, '},')
    }

    let filterCategoryNumeroOS = filterNumeroOS.length == 0 ? servicosNumeroOS : JSON.parse(filterNumeroOS.replace(/.$/, ']').replace(/{"/, '[{"'))
    localStorage.setItem("dados", JSON.stringify(filterCategoryNumeroOS))
    return filterCategoryNumeroOS
}

function itemSelecionadoTipoServico() {    
    let selectContentTipoServico = document.querySelectorAll(".checkItemTipoServico")
    let selectValuesTipoServico = []
    for (let i = 0; i < selectContentTipoServico.length; i++) {
        selectValuesTipoServico += (selectContentTipoServico[i].checked == true ? selectContentTipoServico[i].name : selectContentTipoServico[i].checked) + "¬"
    }
    let arraySelectTipoServico = selectValuesTipoServico.toLowerCase().split("¬")
    let filterSelectTipoServico = arraySelectTipoServico.filter(f => f !== "false" && f !== "")
    
    localStorage.setItem("dados", JSON.stringify(dados))
let getService = localStorage.getItem("dados")
    let servicosTipoServico = JSON.parse(getService)
 
    let filterTipoServico = []
    for (let i = 0; i < filterSelectTipoServico.length; i++) {
        filterTipoServico += JSON.stringify(servicosTipoServico.filter(f => f.TipoServico.toLowerCase() == filterSelectTipoServico[i])).replace(/\[/gi, '').replace(/\}]/gi, '},')
    }

    let filterCategoryTipoServico = filterTipoServico.length == 0 ? servicosTipoServico : JSON.parse(filterTipoServico.replace(/.$/, ']').replace(/{"/, '[{"'))
    localStorage.setItem("dados", JSON.stringify(filterCategoryTipoServico))
    return filterCategoryTipoServico
}


function itemSelecionadoModoServico() {    
    let selectContentModoServico = document.querySelectorAll(".checkItemModoServico")
    let selectValuesModoServico = []
    for (let i = 0; i < selectContentModoServico.length; i++) {
        selectValuesModoServico += (selectContentModoServico[i].checked == true ? selectContentModoServico[i].name : selectContentModoServico[i].checked) + "¬"
    }
    let arraySelectModoServico = selectValuesModoServico.toLowerCase().split("¬")
    let filterSelectModoServico = arraySelectModoServico.filter(f => f !== "false" && f !== "")
    
    let servicosModoServico =servicos
    let filterModoServico = []
    for (let i = 0; i < filterSelectModoServico.length; i++) {
        filterModoServico += JSON.stringify(servicosModoServico.filter(f => f.ModoServico.toLowerCase() == filterSelectModoServico[i])).replace(/\[/gi, '').replace(/\}]/gi, '},')
    }

    let filterCategoryModoServico = filterModoServico.length == 0 ? servicosModoServico : JSON.parse(filterModoServico.replace(/.$/, ']').replace(/{"/, '[{"'))
    localStorage.setItem("dados", JSON.stringify(filterCategoryModoServico))
    return filterCategoryModoServico
}


function filterChartAmountNumeroOS() {
    let filterAmount = itemSelecionadoNumeroOS()
    let amountServices = [];
    for (let i = 0; i < filterAmount.length; i++) {
        amountServices += `${monthService((filterAmount[i].DataHora_FINALIZADO).split("-")[1])},`
    }

    let arrayAmount = amountServices.split(',')

    let dataAmountService = uniqItem(arrayAmount)
    let dataService = dataAmountService.splice(0, dataAmountService.length - 1)

    const labels__amount = decrescente(dataService).map(s => s.status)
    const datas__amount = decrescente(dataService).map(n => n.amount)

    myChart__amount.data.labels = labels__amount
    myChart__amount.data.datasets[0].data = datas__amount
    myChart__amount.update();
}

function filterChartStatusNumeroOS() {
    let filterCategory = itemSelecionadoNumeroOS()
    let desp = filterCategory.map(f => f.Status_DESPACHADO)
    let acte = filterCategory.map(f => f.Status_RECEBIDO)
    let tacm = filterCategory.map(f => f.Status_CAMINHO)
    let inic = filterCategory.map(f => f.Status_INICIAR)
    let fiok1 = filterCategory.map(f => f.Status_PAUSADO)
    let fiok = filterCategory.map(f => f.Status_FINALIZADO)


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

    myChart_status.data.labels = labels__status
    myChart_status.data.datasets[0].data = datas__status
    myChart_status.update();
}

function filterChartCategoryNumeroOS() {
    let filterCategory = itemSelecionadoNumeroOS()
    let categoryServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        categoryServices += `${filterCategory[i].TipoServico+"¬"}`
    }
    let arrayCategory = categoryServices.split('¬')
    let dataCategoryService = uniqItem(arrayCategory)
    let dataServiceCategory = dataCategoryService.splice(0, dataCategoryService.length - 1)
    const labels__category = decrescente(dataServiceCategory).map(s => s.status)
    const datas__category = decrescente(dataServiceCategory).map(n => n.amount)

    myChart_category.data.labels = labels__category
    myChart_category.data.datasets[0].data = datas__category
    myChart_category.update();
}

function filterChartClassNumeroOS() {
    let filterCategory = itemSelecionadoNumeroOS()
    let classServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        classServices += `${filterCategory[i].ModoServico+"¬"}`
    }

    let arrayClass = classServices.split('¬')
    let dataClassService = uniqItem(arrayClass)
    let dataServiceClass = dataClassService.splice(0, dataClassService.length - 1)
    const labels__class = decrescente(dataServiceClass).map(s => s.status)
    const datas__class = decrescente(dataServiceClass).map(n => n.amount)

    myChart_class.data.labels = labels__class
    myChart_class.data.datasets[0].data = datas__class
    myChart_class.update();
}

function filterChartTypeNumeroOS() {
    let filterCategory = itemSelecionadoNumeroOS()
    let typeServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        typeServices += `${filterCategory[i].ExternalTipoServicoName+"¬"}`
    }
    let arrayType = typeServices.split('¬')
    let dataTypeService = uniqItem(arrayType)
    let dataServiceType = dataTypeService.splice(0, dataTypeService.length - 1)
    const labels__type = decrescente(dataServiceType).map(s => s.status)
    const datas__type = decrescente(dataServiceType).map(n => n.amount)

    myChart_type.data.labels = labels__type
    myChart_type.data.datasets[0].data = datas__type
    myChart_type.update();
}

function filterChartAmountTipoServico() {
    let filterAmount = itemSelecionadoTipoServico()
    let amountServices = [];
    for (let i = 0; i < filterAmount.length; i++) {
        amountServices += `${monthService((filterAmount[i].DataHora_FINALIZADO).split("-")[1])},`
    }

    let arrayAmount = amountServices.split(',')

    let dataAmountService = uniqItem(arrayAmount)
    let dataService = dataAmountService.splice(0, dataAmountService.length - 1)

    const labels__amount = decrescente(dataService).map(s => s.status)
    const datas__amount = decrescente(dataService).map(n => n.amount)

    myChart__amount.data.labels = labels__amount
    myChart__amount.data.datasets[0].data = datas__amount
    myChart__amount.update();
}

function filterChartStatusTipoServico() {
    let filterCategory = itemSelecionadoTipoServico()
    let desp = filterCategory.map(f => f.Status_DESPACHADO)
    let acte = filterCategory.map(f => f.Status_RECEBIDO)
    let tacm = filterCategory.map(f => f.Status_CAMINHO)
    let inic = filterCategory.map(f => f.Status_INICIAR)
    let fiok1 = filterCategory.map(f => f.Status_PAUSADO)
    let fiok = filterCategory.map(f => f.Status_FINALIZADO)


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

    myChart_status.data.labels = labels__status
    myChart_status.data.datasets[0].data = datas__status
    myChart_status.update();
}

function filterChartCategoryTipoServico() {
    let filterCategory = itemSelecionadoTipoServico()
    let categoryServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        categoryServices += `${filterCategory[i].TipoServico+"¬"}`
    }
    let arrayCategory = categoryServices.split('¬')
    let dataCategoryService = uniqItem(arrayCategory)
    let dataServiceCategory = dataCategoryService.splice(0, dataCategoryService.length - 1)
    const labels__category = decrescente(dataServiceCategory).map(s => s.status)
    const datas__category = decrescente(dataServiceCategory).map(n => n.amount)

    myChart_category.data.labels = labels__category
    myChart_category.data.datasets[0].data = datas__category
    myChart_category.update();
}

function filterChartClassTipoServico() {
    let filterCategory = itemSelecionadoTipoServico()
    let classServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        classServices += `${filterCategory[i].ModoServico+"¬"}`
    }

    let arrayClass = classServices.split('¬')
    let dataClassService = uniqItem(arrayClass)
    let dataServiceClass = dataClassService.splice(0, dataClassService.length - 1)
    const labels__class = decrescente(dataServiceClass).map(s => s.status)
    const datas__class = decrescente(dataServiceClass).map(n => n.amount)

    myChart_class.data.labels = labels__class
    myChart_class.data.datasets[0].data = datas__class
    myChart_class.update();
}

function filterChartTypeTipoServico() {
    let filterCategory = itemSelecionadoTipoServico()
    let typeServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        typeServices += `${filterCategory[i].ExternalTipoServicoName+"¬"}`
    }
    let arrayType = typeServices.split('¬')
    let dataTypeService = uniqItem(arrayType)
    let dataServiceType = dataTypeService.splice(0, dataTypeService.length - 1)
    const labels__type = decrescente(dataServiceType).map(s => s.status)
    const datas__type = decrescente(dataServiceType).map(n => n.amount)

    myChart_type.data.labels = labels__type
    myChart_type.data.datasets[0].data = datas__type
    myChart_type.update();
}


function filterChartAmountModoServico() {
    let filterAmount = itemSelecionadoModoServico()
    let amountServices = [];
    for (let i = 0; i < filterAmount.length; i++) {
        amountServices += `${monthService((filterAmount[i].DataHora_FINALIZADO).split("-")[1])},`
    }

    let arrayAmount = amountServices.split(',')

    let dataAmountService = uniqItem(arrayAmount)
    let dataService = dataAmountService.splice(0, dataAmountService.length - 1)

    const labels__amount = decrescente(dataService).map(s => s.status)
    const datas__amount = decrescente(dataService).map(n => n.amount)

    myChart__amount.data.labels = labels__amount
    myChart__amount.data.datasets[0].data = datas__amount
    myChart__amount.update();
}

function filterChartStatusModoServico() {
    let filterCategory = itemSelecionadoModoServico()
    let desp = filterCategory.map(f => f.Status_DESPACHADO)
    let acte = filterCategory.map(f => f.Status_RECEBIDO)
    let tacm = filterCategory.map(f => f.Status_CAMINHO)
    let inic = filterCategory.map(f => f.Status_INICIAR)
    let fiok1 = filterCategory.map(f => f.Status_PAUSADO)
    let fiok = filterCategory.map(f => f.Status_FINALIZADO)


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

    myChart_status.data.labels = labels__status
    myChart_status.data.datasets[0].data = datas__status
    myChart_status.update();
}

function filterChartCategoryModoServico() {
    let filterCategory = itemSelecionadoModoServico()
    let categoryServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        categoryServices += `${filterCategory[i].TipoServico+"¬"}`
    }
    let arrayCategory = categoryServices.split('¬')
    let dataCategoryService = uniqItem(arrayCategory)
    let dataServiceCategory = dataCategoryService.splice(0, dataCategoryService.length - 1)
    const labels__category = decrescente(dataServiceCategory).map(s => s.status)
    const datas__category = decrescente(dataServiceCategory).map(n => n.amount)

    myChart_category.data.labels = labels__category
    myChart_category.data.datasets[0].data = datas__category
    myChart_category.update();
}

function filterChartClassModoServico() {
    let filterCategory = itemSelecionadoModoServico()
    let classServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        classServices += `${filterCategory[i].ModoServico+"¬"}`
    }

    let arrayClass = classServices.split('¬')
    let dataClassService = uniqItem(arrayClass)
    let dataServiceClass = dataClassService.splice(0, dataClassService.length - 1)
    const labels__class = decrescente(dataServiceClass).map(s => s.status)
    const datas__class = decrescente(dataServiceClass).map(n => n.amount)

    myChart_class.data.labels = labels__class
    myChart_class.data.datasets[0].data = datas__class
    myChart_class.update();
}

function filterChartTypeModoServico() {
    let filterCategory = itemSelecionadoModoServico()
    let typeServices = [];
    for (let i = 0; i < filterCategory.length; i++) {
        typeServices += `${filterCategory[i].ExternalTipoServicoName+"¬"}`
    }
    let arrayType = typeServices.split('¬')
    let dataTypeService = uniqItem(arrayType)
    let dataServiceType = dataTypeService.splice(0, dataTypeService.length - 1)
    const labels__type = decrescente(dataServiceType).map(s => s.status)
    const datas__type = decrescente(dataServiceType).map(n => n.amount)

    myChart_type.data.labels = labels__type
    myChart_type.data.datasets[0].data = datas__type
    myChart_type.update();
}


function selectCheckbox(search) {
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

let checboxNumeroOS = []
dados.forEach(i => {
    checboxNumeroOS += `<div class="div_checkbox">
    <input type="checkbox" class="checkItemNumeroOS checkbox" id="${i.NumeroOS}" name="${i.NumeroOS}">
    <label for="${i.NumeroOS}">${i.NumeroOS}</label>
</div>`
});
const numeroOSID01 = document.getElementById("numeroOSID01")
numeroOSID01.innerHTML = checboxNumeroOS

let checboxCategoria = []
dataServiceCategory.forEach(i => {
    checboxCategoria += `<div class="div_checkbox">
    <input type="checkbox" class="checkItemTipoServico checkbox" id="${i.status}" name="${i.status}">
    <label for="${i.status}">${i.status}</label>
</div>`
});

let checboxClass = []
dataServiceClass.forEach(i => {
    checboxClass += `<div class="div_checkbox">
    <input type="checkbox" class="checkItemModoServico checkbox" id="${i.status}" name="${i.status}">
    <label for="${i.status}">${i.status}</label>
</div>`
});
const categoriaID01 = document.getElementById("categoriaID01")
categoriaID01.innerHTML = checboxCategoria

const classificationID01 = document.getElementById("classificationID01")
classificationID01.innerHTML = checboxClass

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


document.getElementById("search_numeroOS").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(search_numeroOS);
    }
})

document.getElementById('search_numeroOS').addEventListener("keyup", () => {
    filterCheckbox(search_numeroOS, numeroOSID01)
})


document.querySelector("#numeroOSID01").addEventListener("change", () => {
    filterChartAmountNumeroOS()
    filterChartStatusNumeroOS()
    filterChartCategoryNumeroOS()
    filterChartClassNumeroOS()
    filterChartTypeNumeroOS()
})

document.getElementById("search_classification").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(search_classification);
    }

})

document.querySelector("#classificationID01").addEventListener("change", () => {
    filterChartAmountModoServico()
    filterChartStatusModoServico()
    filterChartCategoryModoServico()
    filterChartClassModoServico()
    filterChartTypeModoServico()
})


document.getElementById('search_classification').addEventListener("keyup", () => {
    filterCheckbox(search_classification, classificationID01)
})
document.getElementById('ico_search_classification').addEventListener("click", function(event) {
    selectCheckbox(search_classification);
})


document.getElementById("search_categoria").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(search_categoria);
        filterCategory(myChart_category, dataServiceCategory)
    }

})

document.querySelector("#categoriaID01").addEventListener("change", () => {
    filterChartAmountTipoServico()
    filterChartStatusTipoServico()
    filterChartCategoryTipoServico()
    filterChartClassTipoServico()
    filterChartTypeTipoServico()
})


document.getElementById('search_categoria').addEventListener("keyup", () => {
    filterCheckbox(search_categoria, categoriaID01)
})

document.getElementById('ico_search_categoria').addEventListener("click", function(event) {
    selectCheckbox(search_categoria);
})


document.getElementById("search_type").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(search_type);
        filterCategory(myChart_type, dataServiceType)
    }

})

document.getElementById('search_type').addEventListener("keyup", () => {
    filterCheckbox(search_type, typeID01)
})

document.getElementById('ico_search_type').addEventListener("click", function(event) {
    selectCheckbox(search_type);
})

document.getElementById("search_status").addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        selectCheckbox(search_status);
        filterCategory(myChart_status, statusdados)
    }

})

document.getElementById('search_status').addEventListener("keyup", () => {
    filterCheckbox(search_status, statusID01)
})

document.getElementById('ico_search_status').addEventListener("click", function(event) {
    selectCheckbox(search_status);
})