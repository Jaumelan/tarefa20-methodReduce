//objeto para obter dados
const dadosIngressados = () => ({
    nome: document.getElementById("clientName").value,
    dataVencimento: new Date(document.getElementById("expirationDate").value),
    valor: parseFloat(document.getElementById("amount").value),
})

//constantes de juros cobrados por Joana
const valoresJuros ={
    mora: 0.02,
    juroPorDia: 0.001,
    dias: 1000*60*60*24
}

//array com os valores da ingressados
const linha = [];

//Função para limpar o formulário
function liberarInputs() {
    document.getElementById("clientName").value = "";
    document.getElementById("expirationDate").value = '';
    document.getElementById("amount").value = '';
}

//popular array com dados
function popularArray() {
    linha.push({...dadosIngressados(),
        diasDeAtraso: 0,
        juros: 0,
        valorComJuros: 0
    });
    document.getElementById("formulario").reset();
    //liberarInputs();
}

//função para calcular dias de morosidade
function diasDeMorosidade(dias) {
    let hoje = new Date();
    //let dif = Math.round(hoje.getTime() - dias.getTime());
    if (hoje.getTime() > dias.getTime()) {
        return Math.round(( hoje.getTime() - dias.getTime() ) / valoresJuros.dias);
    } else {
        return 0;
    }
}

//função para calcular os juros
function calcularJuros(valor) {
    let diasAtrasados = diasDeMorosidade(valor.dataVencimento);
    return diasAtrasados > 0 ? ((valoresJuros.mora + diasAtrasados*valoresJuros.juroPorDia).toFixed(3)) : 0;
}

//função para modificar o array com os calculos
function modificarArray() {
    const linha1 = linha.map(elemento => {
        elemento.nome = elemento.nome,
        elemento.dataVencimento = elemento.dataVencimento,
        elemento.valor = elemento.valor,
        elemento.diasDeAtraso = diasDeMorosidade(elemento.dataVencimento),
        elemento.juros = calcularJuros(elemento),
        elemento.valorComJuros = elemento.valor + elemento.valor*calcularJuros(elemento)
        
        }
    )
}

//função para agrupar
function agruparPor(list, agrupador) {
    return list.reduce(function (acc, obj) {
        let flag = obj[agrupador];
        if (!acc[flag]) {
            acc[flag] = [];
        }
        acc[flag].push(obj);
        return acc;
    }, {});
}

//função para organizar a tabela por nome
function tabelaPorNome() {
    let tabela = document.querySelector("tbody");
    const recebiveisAgrupados = agruparPor(linha, "nome");
    const separadores = Object.keys(recebiveisAgrupados);
    separadores.forEach((separador) => {
        
        let grupo = document.createElement("tr");
        let tituloDoGrupo = document.createElement("th");
        tituloDoGrupo.appendChild(document.createTextNode(separador));
        tituloDoGrupo.setAttribute("colspan", 5);
        
        let total = recebiveisAgrupados[separador].reduce((acc, cuv)=>acc+cuv.valorComJuros,0);
        let celulaTotal = document.createElement("th");
        celulaTotal.appendChild(document.createTextNode(total));

        grupo.appendChild(tituloDoGrupo);
        grupo.appendChild(celulaTotal);
        tabela.appendChild(grupo);

        
        recebiveisAgrupados[separador].forEach((recebivel) => {
            tabela.appendChild(agregarLinhaComDados(recebivel)); 
        })

    })
}

//função para organizar a tabela por data
function tabelaPorData() {
    let tabela = document.querySelector("tbody");
    const recebiveisAgrupados = agruparPor(linha, "dataVencimento");
    const separadores = Object.keys(recebiveisAgrupados);
    separadores.forEach((separador) => {
        let grupo = document.createElement("tr");
        let tituloDoGrupo = document.createElement("th");
        tituloDoGrupo.appendChild(document.createTextNode(separador));
        tituloDoGrupo.setAttribute("colspan", 6);
        grupo.appendChild(tituloDoGrupo);
        tabela.appendChild(grupo);
        recebiveisAgrupados[separador].forEach((recebivel) => {
            tabela.appendChild(agregarLinhaComDados(recebivel));
        })

    })
}

//função para formatar a data
function formatarData(data) {
    return data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
}


//função para formato de dinheiro
function formatarDinheiro(data) {
    return data.toLocaleString('pt-BR' , {stle: 'currency', currency: 'BRL'});
}

//limpar a tabela
function limpardados() {
    let limp = document.querySelector("tbody");
    limp.innerHTML = "";
}

//função para criar linha na tabela
function agregarLinhaComDados(elem) {
    let linha = document.createElement("tr");

    let cliente = document.createElement("th");
    cliente.appendChild(document.createTextNode(elem.nome));
    let vencimento = document.createElement("td");
    vencimento.appendChild(document.createTextNode(formatarData(elem.dataVencimento)));
    let valor = document.createElement("td");
    valor.appendChild(document.createTextNode(formatarDinheiro(elem.valor)));
    let diasDeAtraso = document.createElement("td");
    diasDeAtraso.appendChild(document.createTextNode(elem.diasDeAtraso));
    let juros = document.createElement("td");
    juros.appendChild(document.createTextNode(elem.juros));
    let valorComJuros = document.createElement("td");
    valorComJuros.appendChild(document.createTextNode(formatarDinheiro(elem.valorComJuros)));

    linha.appendChild(cliente);
    linha.appendChild(vencimento);
    linha.appendChild(valor);
    linha.appendChild(diasDeAtraso);
    linha.appendChild(juros);
    linha.appendChild(valorComJuros);
    
    return linha
}

//função para popular a tabela como os dados
function popularTabela () {
    limpardados();
    let tabela = document.querySelector("tbody");
    linha.forEach((item) => {
        tabela.append(agregarLinhaComDados(item))
    })

}

//event listeners
document.getElementById("ingressarDados").addEventListener("click", () => {
    popularArray();
    popularTabela();
})

document.getElementById("ingressarJuros").addEventListener("click", () => {
    modificarArray();
    popularTabela();
})

document.getElementById("agrupar").addEventListener("click", () => {
    limpardados();
    tabelaPorNome();
})

document.getElementById("porData").addEventListener("click", () => {
    limpardados();
    tabelaPorData();
})