    const axios = require('axios');
    const fs = require('fs')
    var con = require('./db.js')

    function servico() {
        var data = new Date();
        data.setDate(data.getDate());
        let diaSplit = data.toLocaleString().slice(0, 10).split("/");
        let diaAtual = diaSplit[2] + "-" + diaSplit[1] + "-" + diaSplit[0];

        var data = new Date();
        data.setDate(data.getDate() - 15);
        let diaFormated = data.toLocaleString().substring(0, 10).split("/");

        let diaAnterior = diaFormated[2] + "-" + diaFormated[1] + "-" + diaFormated[0];
        console.log(diaAnterior, diaAtual);
        const dataOrderService = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
         <GetServiceOrders xmlns="http://www.equiperemota.com.br">
         <authCode>B2D9E139AF70FAE1474385FEB5A995BA0462BC77</authCode>
         <clientCode>FZ18JV3R5XVHTW94I611</clientCode>
         <dataInicio>2023-04-01T00:00:00</dataInicio>
         <dataFim>2023-04-03T23:59:59</dataFim>         
         <flowStateTag>FIOK</flowStateTag>
         </GetServiceOrders>
    </soap:Body>
</soap:Envelope>
`;
        console.log(dataOrderService);
        axios.post('https://ws.goon.mobi/webservices/keeplefieldintegration.asmx?wsdl',
            dataOrderService, {
                headers: { 'Content-Type': 'text/xml' }
            }).then(res => {
            let data = String(res.data)

            const result = data
                .replace('<?xml version="1.0" encoding="utf-8"?>', "")
                .replace(
                    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">',
                    ""
                )
                .replace("<soap:Body>", "")
                .replace(
                    '<GetServiceOrdersResponse xmlns="http://www.equiperemota.com.br">',
                    ""
                )
                .replace("<GetServiceOrdersResult>", "")
                .replace("</GetServiceOrdersResult>", "")
                .replace("</GetServiceOrdersResponse>", "")
                .replace("</soap:Body>", "")
                .replace("</soap:Envelope>", "");
            const reultJSON = JSON.parse(result);
            // console.log(reultJSON);
            let serviceInfo = reultJSON.answersXML.FormAnswers;
            let textJson = [];
            serviceInfo.map((el) => {
                const part1 = `{
            "NumeroOS":"${el.NumeroOS}",
            "ExternalTipoServicoID":"${el.ExternalTipoServicoID}",
            "ClientName":"${el.ClientName}",            
            "MobileAgentName":"${el.MobileAgentName}",
            "DataSolicitacao":"${el.DataSolicitacao}",
                 `
                let part2 = []
                for (let i = 0; i < el.StatusSequence.length; i++) {
                    part2 += `
            "Status_${el.StatusSequence[i].Status}":"${el.StatusSequence[i].Status}",
            "DataHora_${el.StatusSequence[i].Status}":"${el.StatusSequence[i].DataHora}",
            "Longitude_${el.StatusSequence[i].Status}":"${el.StatusSequence[i].Longitude}",
            "Latitude_${el.StatusSequence[i].Status}":"${el.StatusSequence[i].Latitude}"
        ,`
                };
                textJson += part1 + part2
            });
            const jsonFormater = "[" + textJson + "]"
            const jsonString = JSON.stringify(jsonFormater)
                .replace(/"/, '')
                .replace(/\\n            /gi, '')
                .replace(/\\"/gi, '"')
                .replace(/\\n        /gi, '')
                .replace(/       /gi, '')
                .replace(/,]"/gi, ',]')
                .replace(/,{/gi, '},{')
                .replace(/,]/gi, '}]')
                // console.log(jsonString);
            const json = JSON.parse(jsonString)
                // console.log(json);

            function dataHora(anterior, atual) {
                let data1 = new Date(anterior)
                let data2 = new Date(atual)
                var diferenca = new Date(data2 - data1);
                let dia = diferenca.getUTCDate()
                var resultado = (diferenca.getUTCHours() + (dia - 1) * 24) + ":";
                resultado += diferenca.getUTCMinutes() + ":";
                resultado += diferenca.getUTCSeconds();
                return resultado
            }

            tipoAtendimento = [{
                    "numero": "1",
                    "service": "Fibra Óptica - Instalação de CTO",
                    "SLA": "24"
                },
                {
                    "numero": "2",
                    "service": "Fibra Óptica - Instalação de HUB",
                    "SLA": "24"
                },
                {
                    "numero": "3",
                    "service": "Fibra Óptica - Instalação de CEO",
                    "SLA": "24"
                },
                {
                    "numero": "4",
                    "service": "Fibra Óptica - Instalação de DGO",
                    "SLA": "24"
                },
                {
                    "numero": "5",
                    "service": "Fibra Óptica - Instalação de Cliente Corporativo (inativo)",
                    "SLA": "8"
                },
                {
                    "numero": "6",
                    "service": "Fibra Óptica - Lançamento de Cabo",
                    "SLA": "24"
                },
                {
                    "numero": "7",
                    "service": "Fibra Óptica - Instalação de Swap",
                    "SLA": "72"
                },
                {
                    "numero": "8",
                    "service": "Fibra Óptica - Manutenção Corretiva",
                    "SLA": "8"
                },
                {
                    "numero": "9",
                    "service": "Fibra Óptica - Manutenção Preventiva",
                    "SLA": "120"
                },
                {
                    "numero": "10",
                    "service": "Fibra Óptica - Ampliação de Portas de CTO",
                    "SLA": "72"
                },
                {
                    "numero": "11",
                    "service": "Infraestrutura - Instalação Elétrica",
                    "SLA": "24"
                },
                {
                    "numero": "12",
                    "service": "Infraestrutura - Manutenção Preventiva",
                    "SLA": "120"
                },
                {
                    "numero": "13",
                    "service": "Infraestrutura - Manutenção Corretiva",
                    "SLA": "6"
                },
                {
                    "numero": "14",
                    "service": "Infraestrutura - Instalação de Equipamentos",
                    "SLA": "120"
                },
                {
                    "numero": "15",
                    "service": "Transmissão - Instalação de Equipamentos",
                    "SLA": "72"
                },
                {
                    "numero": "16",
                    "service": "Infraestrutura - Reforma Civil",
                    "SLA": "120"
                },
                {
                    "numero": "17",
                    "service": "Infraestrutura - Construção Civil",
                    "SLA": "120"
                },
                {
                    "numero": "18",
                    "service": "Infraestrutura - Instalação de Torre",
                    "SLA": "72"
                },
                {
                    "numero": "19",
                    "service": "Infraestrutura - Instalação de Ar-Condicionado",
                    "SLA": "120"
                },
                {
                    "numero": "20",
                    "service": "Infraestrutura - Documentação e Vistoria",
                    "SLA": "120"
                },
                {
                    "numero": "21",
                    "service": "Transmissão - Manutenção Corretiva",
                    "SLA": "6"
                },
                {
                    "numero": "22",
                    "service": "Transmissão - Manutenção Preditiva",
                    "SLA": "120"
                },
                {
                    "numero": "23",
                    "service": "Transmissão - Documentação e Vistoria",
                    "SLA": "120"
                },
                {
                    "numero": "24",
                    "service": "Transmissão - Desativação",
                    "SLA": "72"
                },
                {
                    "numero": "25",
                    "service": "Infraestrutura - Instalação de Poste",
                    "SLA": "72"
                },
                {
                    "numero": "26",
                    "service": "Acesso - Instalação de Equipamentos",
                    "SLA": "72"
                },
                {
                    "numero": "27",
                    "service": "Acesso - Manutenção Corretiva",
                    "SLA": "8"
                },
                {
                    "numero": "28",
                    "service": "Acesso - Manutenção Preventiva",
                    "SLA": "120"
                },
                {
                    "numero": "29",
                    "service": "Acesso - Documentação e Vistoria",
                    "SLA": "120"
                },
                {
                    "numero": "30",
                    "service": "Acesso - Desativação",
                    "SLA": "96"
                },
                {
                    "numero": "31",
                    "service": "Infraestrutura - Desativação",
                    "SLA": "96"
                },
                {
                    "numero": "32",
                    "service": "Instalação de Cliente Corporativo",
                    "SLA": "72"
                },
                {
                    "numero": "33",
                    "service": "Acesso - Serviços Internos",
                    "SLA": "120"
                },
                {
                    "numero": "34",
                    "service": "Core - Instalação de Equipamentos",
                    "SLA": "120"
                },
                {
                    "numero": "35",
                    "service": "Core - Manutenção Corretiva",
                    "SLA": "4"
                },
                {
                    "numero": "36",
                    "service": "Core - Manutenção Preventiva",
                    "SLA": "120"
                },
                {
                    "numero": "37",
                    "service": "Fibra Óptica - Certificação e Documentação",
                    "SLA": "120"
                },
                {
                    "numero": "38",
                    "service": "Infraestrutura - Serviços Internos",
                    "SLA": "72"
                },
                {
                    "numero": "39",
                    "service": "Infraestrutura - Serviços Fora da Empresa",
                    "SLA": "120"
                },
                {
                    "numero": "40",
                    "service": "Infraestrutura - Manutenção de Ar-Condicionado",
                    "SLA": "24"
                },
                {
                    "numero": "41",
                    "service": "Acesso - Manutenção Preditiva",
                    "SLA": "48"
                },
                {
                    "numero": "42",
                    "service": "Core - Manutenção Preditiva",
                    "SLA": "24"
                },
                {
                    "numero": "43",
                    "service": "Transmissão -  Manutenção Preventiva",
                    "SLA": "0"
                },
                {
                    "numero": "44",
                    "service": "Infraestrutura - Manutenção Preditiva",
                    "SLA": "48"
                },
                {
                    "numero": "45",
                    "service": "Core - Desativação",
                    "SLA": "120"
                }
            ]


            function tipoSLA(externalTipoServicoIDs) {
                let filter = tipoAtendimento.filter(f => f.numero === externalTipoServicoIDs)
                let sla = filter[0].SLA
                return sla
            }

            // console.log(json[13].NumeroOS);
            // console.log(tipoSLA(json[13].ExternalTipoServicoID));
            // console.log(atendeuSLA(tipoSLA(json[13].ExternalTipoServicoID), dataHora(json[13].DataHora_DESP, json[13].DataHora_FIOK)));

            function atendeuSLA(sla, finalizado) {
                let hora = parseInt(finalizado.split(":"));
                if (hora <= sla) {
                    return "Sim"
                } else {
                    return "Não"
                }
            }

            function tiposervice(number) {
                let filter = tipoAtendimento.filter(f => f.numero == number)
                let service = filter[0].service
                return service
            }

            function modoServico(number) {
                if (tiposervice(number).search("Fora") > 0) {
                    return "FORA DA EMPRESA"
                } else if (tiposervice(number).search("Interno") > 0) {
                    return "SERVIÇOS INTERNOS"
                } else if (tiposervice(number).search("Manutenção") < 0) {
                    return "IMPLANTAÇÃO"
                } else if (tiposervice(number).search("Corretiva") > 0) {
                    return "MANUTENÇÃO CORRETIVA"
                } else if (tiposervice(number).search("Preventiva") > 0) {
                    return "MANUTENÇÃO PREVENTIVA"
                } else if (tiposervice(number).search("Preditiva") > 0) {
                    return "MANUTENÇÃO PREDETIVA"
                }
            }

            let jsonService = []
            for (let i = 0; i < json.length; i++) {
                jsonService += `{"NumeroOS": "${json[i].NumeroOS}",
                "ExternalTipoServicoID":"${json[i].ExternalTipoServicoID}",
                "ExternalTipoServicoName": "${tiposervice(json[i].ExternalTipoServicoID)}",
                "TipoServico": "${tiposervice(json[i].ExternalTipoServicoID).substring(0, tiposervice(json[i].ExternalTipoServicoID).search(" - ")?tiposervice(json[i].ExternalTipoServicoID).search(" "):tiposervice(json[i].ExternalTipoServicoID).search(" - "))}",
                "ModoServico": "${modoServico(json[i].ExternalTipoServicoID)}",
                "ClientName": "${json[i].ClientName}",
                "MobileAgentName": "${json[i].MobileAgentName}",
                "DataSolicitacao": "${json[i].DataSolicitacao}",
                "Status_DESPACHADO": "${json[i].Status_DESP}",
                "DataHora_DESPACHADO": "${json[i].DataHora_DESP}",
                "Longitude_DESPACHADO": "${json[i].Longitude_DESP}",
                "Latitude_DESPACHADO": "${json[i].Latitude_DESP}",
                "Status_RECEBIDO": "${json[i].Status_ACTE}",
                "DataHora_RECEBIDO": "${json[i].DataHora_ACTE}",
                "Longitude_RECEBIDO": "${json[i].Longitude_ACTE}",
                "Latitude_RECEBIDO": "${json[i].Latitude_ACTE}",
                "Status_CAMINHO": "${json[i].Status_TACM}",
                "DataHora_CAMINHO": "${json[i].DataHora_TACM}",
                "Longitude_CAMINHO": "${json[i].Longitude_TACM}",
                "Latitude_CAMINHO": "${json[i].Latitude_TACM}",
                "Status_INICIAR": "${json[i].Status_INIC}",                
                "DataHora_INICIAR": "${json[i].DataHora_INIC}",
                "Longitude_INICIAR": "${json[i].Longitude_INIC}",
                "Latitude_INICIAR": "${json[i].Latitude_INIC}",
                "Status_PAUSADO": "${json[i].Status_FIOK1}",
                "DataHora_PAUSADO": "${json[i].DataHora_FIOK1}",
                "Longitude_PAUSADO": "${json[i].Longitude_FIOK1}",
                "Latitude_PAUSADO": "${json[i].Latitude_FIOK1}",
                "Status_FINALIZADO": "${json[i].Status_FIOK}",
                "DataHora_FINALIZADO": "${json[i].DataHora_FIOK}",
                "Longitude_FINALIZADO": "${json[i].Longitude_FIOK}",
                "Latitude_FINALIZADO":"${json[i].Latitude_FIOK}",
                "TOTAL_DE_HORA_PARA_O_INICIO_DA_ATIVIDADE":"${dataHora(json[i].DataHora_TACM, json[i].DataHora_DESP)}",
                "TOTAL_DE_HORAS_EM_VIAGEM":"${dataHora(json[i].DataHora_TACM, json[i].DataHora_INIC)}",
                "TOTAL_DE_HORAS_EM_ATENDIMENTO":"${dataHora(json[i].DataHora_INIC, json[i].DataHora_FIOK)}",
                "TEMPO_DE_DURACAO_DA_ATIVIDADE":"${dataHora(json[i].DataHora_TACM, json[i].DataHora_FIOK)}",
                "Tempo_Total_de_Atendimento":"${dataHora(json[i].DataHora_DESP, json[i].DataHora_FIOK)}",
                "SLA":"${tipoSLA(json[i].ExternalTipoServicoID)}",
                "Atendeu_SLA":"${atendeuSLA(tipoSLA(json[i].ExternalTipoServicoID), dataHora(json[i].DataHora_DESP, json[i].DataHora_FIOK))}"},`

            }

            console.log(jsonService);
            let stringServicos = JSON.stringify([jsonService])
            let servicosClear = stringServicos.replace(/undefined/, '').replace(/\["{/, '[{').replace(/},"]/, '}]').replace(/\\n                /gi, '').replace(/\\"/gi, '"').replace(/\\n /gi, '').replace(/                /gi, '')
            let servico = JSON.parse(servicosClear)
                // console.log(servico);

            let servicos;
            for (let i = 0; i < json.length; i++) {
                servicos +=
                    //enviar dados ao banco
                    con.connect(function(err) {
                        if (err) throw err;
                        var sql = `INSERT IGNORE INTO services(NumeroOS, ExternalTipoServicoID, ExternalTipoServicoName, TipoServico, ModoServico, ClientName, MobileAgentName, DataSolicitacao, Status_DESPACHADO, DataHora_DESPACHADO, Longitude_DESPACHADO, Latitude_DESPACHADO, Status_RECEBIDO,DataHora_RECEBIDO, Longitude_RECEBIDO, Latitude_RECEBIDO, Status_CAMINHO, DataHora_CAMINHO, Longitude_CAMINHO, Latitude_CAMINHO, Status_INICIAR, DataHora_INICIAR, Longitude_INICIAR, Latitude_INICIAR, Status_PAUSADO, DataHora_PAUSADO, Longitude_PAUSADO, Latitude_PAUSADO, Status_FINALIZADO, DataHora_FINALIZADO, Longitude_FINALIZADO, Latitude_FINALIZADO, TOTAL_DE_HORA_PARA_O_INICIO_DA_ATIVIDADE, TOTAL_DE_HORAS_EM_VIAGEM, TOTAL_DE_HORAS_EM_ATENDIMENTO, TEMPO_DE_DURACAO_DA_ATIVIDADE, Tempo_Total_de_Atendimento, SLA, Atendeu_SLA) 
                               VALUES (
                               ${json[i].NumeroOS},
                               '${json[i].ExternalTipoServicoID}',
                               '${tiposervice(json[i].ExternalTipoServicoID)}',
                               '${tiposervice(json[i].ExternalTipoServicoID).substring(0, tiposervice(json[i].ExternalTipoServicoID).search(" - ")?tiposervice(json[i].ExternalTipoServicoID).search(" "):tiposervice(json[i].ExternalTipoServicoID).search(" - "))}',
                               '${modoServico(json[i].ExternalTipoServicoID)}',
                               '${json[i].ClientName}','${json[i].MobileAgentName}',
                               '${json[i].DataSolicitacao}','${json[i].Status_DESP}',
                               '${json[i].DataHora_DESP}','${json[i].Longitude_DESP}',
                               '${json[i].Latitude_DESP}',
                               '${json[i].Status_ACTE}','${json[i].DataHora_ACTE}',
                               '${json[i].Longitude_ACTE}','${json[i].Latitude_ACTE}',
                               '${json[i].Status_TACM}',
                               '${json[i].DataHora_TACM}','${json[i].Longitude_TACM}',
                               '${json[i].Latitude_TACM}','${json[i].Status_INIC}',
                               '${json[i].DataHora_INIC}','${json[i].Longitude_INIC}',
                               '${json[i].Latitude_INIC}','${json[i].Status_FIOK1}',
                               '${json[i].DataHora_FIOK1}','${json[i].Longitude_FIOK1}',
                               '${json[i].Latitude_FIOK1}','${json[i].Status_FIOK}',
                               '${json[i].DataHora_FIOK}','${json[i].Longitude_FIOK}',
                               '${json[i].Latitude_FIOK}',
                               '${(dataHora(json[i].DataHora_TACM,json[i].DataHora_DESP).split(":")[0]<500?dataHora(json[i].DataHora_TACM,json[i].DataHora_DESP):dataHora(json[i].DataHora_DESP,json[i].DataHora_TACM))}',
                               '${dataHora(json[i].DataHora_TACM, json[i].DataHora_INIC)}',
                               '${dataHora(json[i].DataHora_INIC, json[i].DataHora_FIOK)}',
                               '${dataHora(json[i].DataHora_TACM, json[i].DataHora_FIOK)}',
                               '${dataHora(json[i].DataHora_DESP, json[i].DataHora_FIOK)}',
                               '${tipoSLA(json[i].ExternalTipoServicoID)?0:tipoSLA(json[i].ExternalTipoServicoID)}',
                               '${atendeuSLA(tipoSLA(json[i].ExternalTipoServicoID), dataHora(json[i].DataHora_DESP, json[i].DataHora_FIOK))}')`;
                        con.query(sql, function(err, result) {
                            if (err) throw err;
                            console.log(`${json[i].NumeroOS} record inserted`);
                            // console.log(err);
                        });

                    });
            }
            console.log(servicos);
            con.end(); // close connection outside the callbacks

        }).catch(err => { console.log(err) })

    }

    servico()

    function services() {
        setInterval(() => {
            console.log("timer");
            servico()
        }, 500000);
    }

    services()