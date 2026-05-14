let projetos = JSON.parse(localStorage.getItem("projetos")) || [];

function salvar(){
    localStorage.setItem("projetos", JSON.stringify(projetos));
    render();
    listarProjetos();
}

function addProjeto(){

    let nomeProjeto = document.getElementById("projeto").value;

    if(!nomeProjeto) return;

    projetos.push({
        nome:nomeProjeto,
        custos:[]
    });

    document.getElementById("projeto").value="";

    salvar();
}

function listarProjetos(){

    let lista = document.getElementById("listaProjetos");

    if(!lista) return;

    lista.innerHTML="";

    projetos.forEach((p,index)=>{

        lista.innerHTML += `
        <div class="finance-box">
            <h3>${p.nome}</h3>
            <button class="btn" onclick="removerProjeto(${index})">
            Remover
            </button>
        </div>
        `;
    });
}

function removerProjeto(index){
    projetos.splice(index,1);
    salvar();
}

function addItem(){

    if(projetos.length === 0){
        alert("Adicione um projeto primeiro");
        return;
    }

    let item = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        valor: parseFloat(document.getElementById("valor").value),
        pagamento: document.getElementById("pagamento").value,
        status: document.getElementById("status").value,
        data: document.getElementById("data").value,
        obs: document.getElementById("obs").value
    };

    projetos[0].custos.push(item);

    salvar();
}

function render(){

    let lista = document.getElementById("listaCustos");

    if(!lista) return;

    lista.innerHTML="";

    let total=0;
    let pago=0;
    let pendente=0;

    let filtroCat = document.getElementById("filtroCategoria")?.value || "";
    let filtroStatus = document.getElementById("filtroStatus")?.value || "";

    projetos.forEach((projeto,pIndex)=>{

        projeto.custos.forEach((item,index)=>{

            if(filtroCat && item.categoria !== filtroCat) return;
            if(filtroStatus && item.status !== filtroStatus) return;

            total += item.valor;

            if(item.status==="Pago"){
                pago += item.valor;
            }else{
                pendente += item.valor;
            }

            lista.innerHTML += `
            <div class="finance-box">
                <h3>${item.nome}</h3>
                <p>Projeto: ${projeto.nome}</p>
                <p>${item.categoria}</p>
                <p>R$ ${item.valor}</p>
                <p>${item.pagamento}</p>
                <p>${item.status}</p>
                <p>${item.data}</p>
                <p>${item.obs}</p>

                <button class="btn"
                onclick="remover(${pIndex},${index})">
                Remover
                </button>
            </div>
            `;
        });

    });

    document.getElementById("total").innerHTML =
    `Custo Total: R$ ${total}`;

    document.getElementById("pago").innerHTML =
    `Pago: R$ ${pago}`;

    document.getElementById("pendente").innerHTML =
    `Pendente: R$ ${pendente}`;
}

function remover(pIndex,index){

    projetos[pIndex].custos.splice(index,1);

    salvar();
}

async function carregarCotacao(){

    const resposta = await fetch(
        "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL"
    );

    const dados = await resposta.json();

    const cotacao = document.getElementById("cotacao");

    if(cotacao){
        cotacao.innerHTML =
        `
        Dólar: R$ ${dados.USDBRL.bid}<br>
        Euro: R$ ${dados.EURBRL.bid}
        `;
    }
}

async function buscarCEP(){

    const cep = document.getElementById("cep").value;

    const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
    );

    const dados = await resposta.json();

    document.getElementById("cidade").value =
    dados.localidade;

    document.getElementById("estado").value =
    dados.uf;
}

listarProjetos();
render();
carregarCotacao();



