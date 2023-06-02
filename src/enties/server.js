const express = require('express')
const server = express()
const router = express.Router()
const fs = require('fs')

server.use(express.json({ extended: true }))

const readFile = () => {
    const content = fs.readFileSync('servicos.json', 'utf-8')
    return JSON.parse(content)
}

const writeFile = (content) => {
    const uptdadeFile = JSON.stringify(content)
    fs.writeFileSync('servicos.json', uptdadeFile, 'utf-8')
}

router.get('/', (req, res) => {
    const content = readFile()
    res.send(content)
})


router.get('/:id', (req, res) => {
    const { id } = req.params
    const currentContent = readFile()
    const selectServicos = currentContent.filter(i => i.NumeroOS === id)
    res.send(selectServicos)
})

// router.put('/:id', (req, res) => {
//     const { id } = req.params
//     const { img, nome, senha, telefone, celular, whatsapp, endereco, grupo, privilegio, "campo": [{ mes, hora, video, publicacao, revisita, estudo, observacao }] } = req.body
//     const currentContent = readFile()
//     const selectServicos = currentContent.findIndex(i => i.id === id)
//     const { id: iId, img: iImg, nome: iNome, senha: iSenha, telefone: iTelefone, celular: iCelular, whatsapp: iWhatsapp, endereco: iEndereco, grupo: iGrupo, privilegio: iPrivilegio, "campo": [{ mes: iMes, hora: iHora, video: iVideo, publicacao: iPublicacao, revisita: iRevisita, estudo: iEstudo, observacao: iObservacao }] } = currentContent[selectIrmaos]
//     const newObject = {
//         id: iId,
//         img: img ? img : iImg,
//         nome: nome ? nome : iNome,
//         senha: senha ? senha : iSenha,
//         telefone: telefone ? telefone : iTelefone,
//         celular: celular ? celular : iCelular,
//         whatsapp: whatsapp ? whatsapp : iWhatsapp,
//         endereco: endereco ? endereco : iEndereco,
//         grupo: grupo ? grupo : iGrupo,
//         privilegio: privilegio ? privilegio : iPrivilegio,
//         "campo": [{
//             mes: mes ? mes : iMes,
//             hora: hora ? hora : iHora,
//             video: video ? video : iVideo,
//             publicacao: publicacao ? publicacao : iPublicacao,
//             revisita: revisita ? revisita : iRevisita,
//             estudo: estudo ? estudo : iEstudo,
//             observacao: observacao ? observacao : iObservacao
//         }]
//     }
//     currentContent[selectServicos] = newObject
//     writeFile(currentContent)
//     res.send(newObject)
// })

// router.delete('/delete/:id', (req, res) => {
//     const { id } = req.params
//     const currentContent = readFile()
//     const selectServicos = currentContent.findIndex(i => i.id === id)
//     currentContent.splice(selectServicos, 1)
//     writeFile(currentContent)
//     res.send(true)
// })

server.use(router)
const port = 3000
server.listen(port, () => {
    console.log(`http://localhost:${port}`);
})