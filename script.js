document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cep');
    const inputCep = document.getElementById('input-cep');
    const dadosEndereco = document.getElementById('dados-endereco');
    const listaHistorico = document.getElementById('lista-historico');
    const btnLimpar = document.getElementById('btn-limpar-historico');

    // Inicializa o histórico do LocalStorage
    let historicoCEPs = JSON.parse(localStorage.getItem('historico_ceps')) || [];

    // Função para renderizar o histórico na tela
    function atualizarInterfaceHistorico() {
        listaHistorico.innerHTML = '';
        historicoCEPs.forEach(cep => {
            const li = document.createElement('li');
            li.textContent = `📍 CEP: ${cep}`;
            li.addEventListener('click', () => {
                inputCep.value = cep;
                consultarAPI(cep);
            });
            listaHistorico.appendChild(li);
        });
    }

    // Função assíncrona para consumo da API ViaCEP
    async function consultarAPI(cep) {
        dadosEndereco.innerHTML = '<p class="placeholder-text">Buscando dados na API...</p>';
        
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            
            if (!resposta.ok) {
                throw new Error("Falha na conexão com o servidor da API.");
            }

            const dados = await resposta.json();

            if (dados.erro) {
                dadosEndereco.innerHTML = '<p style="color: red;">CEP não encontrado na base de dados.</p>';
                return;
            }

            // Alteração Dinâmica do DOM com os resultados
            dadosEndereco.innerHTML = `
                <div class="resultado-item">
                    <p><strong>Logradouro:</strong> ${dados.logradouro || 'N/A'}</p>
                    <p><strong>Bairro:</strong> ${dados.bairro || 'N/A'}</p>
                    <p><strong>Cidade/UF:</strong> ${dados.localidade} - ${dados.uf}</p>
                    <p><strong>IBGE:</strong> ${dados.ibge}</p>
                </div>
            `;

            // Persistência de dados: Salva no histórico se não for repetido
            if (!historicoCEPs.includes(cep)) {
                historicoCEPs.unshift(cep); // Adiciona ao início da lista
                if (historicoCEPs.length > 5) historicoCEPs.pop(); // Mantém apenas os 5 últimos
                localStorage.setItem('historico_ceps', JSON.stringify(historicoCEPs));
                atualizarInterfaceHistorico();
            }

        } catch (erro) {
            dadosEndereco.innerHTML = `<p style="color: red;">Erro ao processar: ${erro.message}</p>`;
        }
    }

    // Listener de submissão do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página
        const cepLimpo = inputCep.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cepLimpo.length === 8) {
            consultarAPI(cepLimpo);
        } else {
            alert("Por favor, digite um CEP válido contendo 8 números.");
        }
    });

    // Limpar Histórico Local
    btnLimpar.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita efeitos colaterais na cadeia do DOM
        historicoCEPs = [];
        localStorage.removeItem('historico_ceps');
        atualizarInterfaceHistorico();
    });

    // Renderização inicial
    atualizarInterfaceHistorico();
});