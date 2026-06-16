RELATÓRIO DE DESENVOLVIMENTO: PORTAL DE BUSCA DE ENDEREÇOS OTIMIZADO

Componente Curricular: Desenvolvimento Web Front-End Avançado

Discente: Gabriel de carvalho santana

1. Descrição da Estrutura HTML
A arquitetura de marcação do projeto foi concebida utilizando exclusivamente o
HTML5 Semântico, seguindo as diretrizes de SEO (Search Engine Optimization) e
padrões internacionais de acessibilidade (WAI-ARIA).

A organização das tags foi estruturada para dividir claramente as
responsabilidades de conteúdo:
• <header>: Delimita o topo da aplicação, contendo o título principal e os
metadados textuais de identificação do portal.

• <main>: Funciona como o container principal de dados, isolando o fluxo
central da aplicação e otimizando a leitura por leitores de tela.

• <section>: Utilizada para segmentar os três blocos funcionais
independentes do sistema: o formulário de busca (#busca-section), o
painel de exibição de resultados (#resultado-section) e o módulo de
persistência (#historico-section).

• Atributos de Acessibilidade: O uso do atributo aria-live="polite" na seção
de resultados garante que usuários com deficiência visual sejam
notificados imediatamente pelo leitor de tela assim que os dados do
endereço forem injetados de forma assíncrona, sem interromper
abruptamente sua navegação.

2. Estilos CSS e Design Responsivo
A estilização do portal foi arquitetada sob a metodologia Mobile-First, onde o
design padrão foi codificado para telas reduzidas (smartphones) e,
posteriormente, escalado para resoluções maiores via Media Queries.

As seguintes técnicas avançadas do CSS3 foram aplicadas para garantir
flexibilidade e responsividade:
• CSS Grid: Utilizado no #main-container para gerenciar a distribuição dos
painéis.
Em telas mobile, o grid se comporta como uma coluna única
vertical (grid-template-columns: 1fr). Em telas com largura igual ou
superior a 768px, o layout se reorganiza automaticamente em duas colunas
simétricas, aproveitando melhor o espaço horizontal dos desktops.

• Flexbox: Empregado no alinhamento interno dos elementos do formulário
e no cabeçalho do histórico (.historico-header), facilitando a distribuição
do espaçamento e o alinhamento vertical dos botões e campos de entrada
de texto.

• Variáveis Nativas (CSS Variables): A criação de propriedades
customizadas no escopo :root (como --primary-color e --card-bg)

3. Interatividade com JavaScript e Manipulação do DOM
O comportamento dinâmico do portal é governado por um script em JavaScript
que atua como o Controller da interface, interceptando as intenções do usuário
na camada de visualização (View) e alterando cirurgicamente a árvore de nós do
documento (DOM).

A interatividade foi estruturada com base nos seguintes conceitos:
• Captura de Eventos (addEventListener): O sistema monitora o evento de
submissão do formulário (submit) e cliques de botões. O uso de
e.preventDefault() foi indispensável para bloquear o comportamento
padrão do navegador de recarregar a página, permitindo a experiência de
uma Single Page Application (SPA).

• Isolamento de Fluxo (stopPropagation): Aplicado no botão de limpeza do
histórico para garantir que o clique no botão interno não disparasse
eventos indesejados nos elementos ancestrais da hierarquia do DOM.

centralizou a paleta de cores e propriedades do sistema, permitindo que
futuras manutenções estéticas ou a implementação de um tema escuro
global sejam feitas alterando apenas uma linha de código.

JavaScript
// Exemplo de manipulação do DOM e interceptação de eventos no formulário
form.addEventListener('submit', (e) => {
 e.preventDefault(); // Bloqueia o refresh da página
 const cepLimpo = inputCep.value.replace(/\D/g, ''); // Sanitização de dados
 if (cepLimpo.length === 8) {
 consultarAPI(cepLimpo); // Dispara a lógica de negócio
 } else {
 alert("Por favor, digite um CEP válido.");
 }
});

4. Integração com API (Lógica e Assincronismo)
A integração de dados externos foi realizada consumindo a API pública e aberta do
ViaCEP. O fluxo assíncrono foi construído com a sintaxe moderna do JavaScript,
utilizando async/await e a API nativa fetch, o que torna o código mais legível do
que o uso tradicional de Promises encadeadas (.then).

Para garantir a estabilidade e a qualidade do software, o fluxo foi encapsulado em
um bloco de tratamento de exceções try...catch:

1. O sistema faz uma requisição HTTP do tipo GET para a URL dinâmica do
serviço.

2. A resposta é convertida em um objeto manipulável via resposta.json().

3. Caso a comunicação falhe (falta de internet, servidor da API fora do ar) ou o
CEP não seja localizado, o fluxo é desviado para o bloco catch, que trata o
erro exibindo um aviso estilizado na tela, evitando a quebra do script.

JavaScript
// Trecho técnico do consumo assíncrono e tratamento de erros
try {
 const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
 if (!resposta.ok) throw new Error("Serviço indisponível temporariamente.");
 const dados = await resposta.json();
 if (dados.erro) {
 dadosEndereco.innerHTML = '<p style="color: red;">CEP inexistente.</p>';
 return;
 }
 // Injeta os dados limpos no DOM caso o fluxo seja bem-sucedido
} catch (erro) {
 dadosEndereco.innerHTML = `<p style="color: red;">Erro de rede:
${erro.message}</p>`;
}

5. Otimização de Desempenho e Usabilidade
Em conformidade com os requisitos da Fase 3 de engenharia de performance, a
aplicação implementou as seguintes táticas de otimização:

• Lazy Loading Nativo: Inserido na tag de imagem pesada presente no
rodapé do site (loading="lazy"). Isso instrui o navegador a adiar o download
do arquivo de imagem até que o usuário role a página para perto do rodapé,
reduzindo o consumo de dados móveis e acelerando o tempo de
renderização inicial (First Contentful Paint).

• Persistência Estruturada (Local Storage): O histórico de buscas é
serializado via JSON.stringify() e armazenado no navegador. Ao reabrir o
portal, o sistema lê os dados via JSON.parse(). Isso otimiza o uso da banda,
pois o usuário pode reconsultar um CEP clicando no seu histórico local
sem a necessidade de realizar uma nova chamada HTTP à API externa.

• Sanitização de Input: O script remove caracteres especiais antes do envio
da requisição, economizando processamento no servidor de destino e
mitigando o tráfego de dados inválidos pela rede.

6. Conclusão e Reflexão
A jornada de desenvolvimento deste projeto ao longo das três fases materializou a
importância prática de projetar softwares seguindo padrões de mercado. O maior
desafio técnico residiu na coordenação do assincronismo do JavaScript: garantir
que a interface gráfica respondesse de forma amigável ao usuário enquanto
aguardava o retorno de dados de uma API externa de terceiros. Esse problema foi
mitigado com sucesso injetando estados de loading temporários na árvore do
DOM e utilizando um tratamento rigoroso de erros.

A experiência solidificou o entendimento de que interfaces modernas de alta
performance dependem diretamente do equilíbrio entre uma estrutura HTML leve,
estilos CSS que evitem reflows custosos na tela e um JavaScript focado no
reaproveitamento de dados (como o uso do Local Storage). Os conhecimentos
adquiridos fornecem a base necessária para o desenvolvimento de aplicações
escaláveis, resilientes e totalmente focadas na usabilidade do cliente final.
