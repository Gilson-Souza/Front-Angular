# Front-Angular
Repositorio destinados aos projetos Angular

Projeto Candidato

O projeto [candidato] é uma aplicatição Angular que consome uma API de candidatos para realizar operações de CRUD (Create, Read, Update, Delete). O objetivo deste projeto é fornecer uma interface de usuário intuitiva para gerenciar candidatos e suas informações relacionadas.

O aplicativo possui os seguintes recursos e componentes principais:

1. Componentes:
   - AppComponent: é o componente raiz do aplicativo e contém o layout principal.
   - CandidatoListComponent: exibe a página inicial do aplicativo, onde são listados todos os candidatos cadastrados.
   - CandidatoDisplayComponent: exibe os detalhes de um candidato específico, incluindo seu nome, informações de filiação, endereço, telefones e cursos associados.
   - CandidatoFormComponent: fornece um formulário reativo para adicionar candidatos, com campos para nome, filiação, endereço, telefones e cursos.
   - CandidateEditComponent: fornece um formulário reativo para edição de candidatos.
  
2. Serviços:
   - CandidatoService: é responsável por realizar as chamadas HTTP à API de candidatos. Ele fornece métodos para display, list, save, edit e delete candidatos na API.
  
3. Rotas:
   - O aplicativo utiliza o Angular Router para gerenciar as rotas e navegação entre os diferentes componentes. As rotas definidas incluem a página inicial, detalhes do candidato e formulário de candidato.

Ao utilizar o aplicativo, os usuários podem visualizar a lista de candidatos cadastrados na página inicial. Ao clicar em um icone de visualização do candidato, eles são redirecionados para a página de detalhes, onde podem ver todas as informações específicas do candidato. Além disso, o formulário de candidato permite a adição de novos candidatos ou a edição dos existentes, proporcionando uma interface intuitiva para a realização de operações de CRUD.

A integração com a API de candidatos é realizada através do CandidateService, que encapsula as chamadas HTTP e fornece métodos convenientes para interagir com os candidatos na API. Isso inclui buscar todos os candidatos, buscar um candidato específico por ID, adicionar um novo candidato, atualizar as informações de um candidato existente e excluir um candidato.

Em resumo, o projeto Angular [candidato] oferece uma interface de usuário amigável e responsiva para gerenciar candidatos, utilizando uma API de candidatos para realizar operações de CRUD. Os componentes, serviços e rotas são projetados para facilitar a visualização, edição, adição e exclusão de candidatos, proporcionando uma experiência de usuário eficiente e intuitiva.
