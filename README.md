# Meu Portal Sagrado — Santuário Pessoal de Estudos

Bem-vindo(a) ao **Meu Portal Sagrado**, um santuário pessoal de estudos e práticas espirituais do programa **Portal Sagrado da Prosperidade**.

A aplicação foi projetada para ser hospedada em uma **única URL compartilhada** (ex: na Vercel), permitindo acesso multiusuário simples, privado e seguro sem a necessidade de contas, senhas ou banco de dados em servidor.

---

## 🔒 Arquitetura Multiusuário sem Autenticação

1. **Acesso Sem Barreiras**: Nenhum visitante precisa criar conta, cadastrar e-mail ou digitar senha. O acesso é instantâneo e universal.
2. **Isolamento Total por Navegador**: Todos os hábitos marcados, reflexões matinais/noturnas e anotações do Diário Sagrado ficam salvos exclusivamente no `localStorage` do navegador do visitante.
3. **Privacidade Absoluta**: Nenhum dado pessoal é transmitido para qualquer servidor ou nuvem. O que um visitante escreve permanece apenas em seu aparelho.
4. **Estado Inicial Zerado**: Cada novo perfil ou dispositivo que acessa a URL compartilhada inicia com a aplicação completamente limpa, sem registros prévios do proprietário ou de outros usuários.
5. **Backup & Restauração Completa em JSON**:
   - Cada usuário pode fazer o download de um arquivo `.json` com todo o seu progresso a qualquer momento.
   - Para transferir o diário para outro celular ou computador, basta acessar o portal no novo dispositivo e clicar em **Restaurar Backup (JSON)**.

---

## 🌟 Estética & Filosofia de Design

- **Fundo Marfim Quente** (`#FAF7F2`) e superfícies suaves em bege
- **Acentos em Ouro Champagne** (`#C5A880`) com gradientes finos
- **Acentos em Ameixa Profunda e Púrpura Suave** (`#221222`, `#351933`, `#4A2546`)
- **Tipografia Editorial Sagrada** (*Cinzel* para títulos e emblemas, *Cormorant Garamond* para textos de inspiração e *Plus Jakarta Sans* para clareza funcional)
- **Geometria Sagrada Sutil** (marca d'água semente/flor da vida e proporções áureas)
- **Ressonância 432Hz** (sintetizador de som ambiente meditativo nativo via Web Audio API)

---

## 🏛️ Estrutura & Funcionalidades

### 1. Visão Geral (Dashboard Principal)
- Saudação dinâmica conforme o horário do dia e data formatada por extenso em português
- Anel de progresso diário em tempo real (0 a 100%)
- Cartões de acesso rápido para as práticas matinal e noturna com indicadores de conclusão
- Acesso direto com capa visual em alta resolução aos dois livros da biblioteca de estudos
- Contador de sequência de dias de luz (Streak de consistência)
- Exibição de mantras diários rotativos de prosperidade
- Painel de reflexões recentes salvas no diário com estado vazio convidativo

### 2. Prática Matinal: Ative seu Personagem de Matriz de Alma
- **Vídeo Incorporado**: Aula guiada por Ednalva Brito (`https://youtu.be/lis25LXrSj8`) em player 16:9 responsivo
- Botão interativo para **Marcar como Concluída** (com celebração e feedback)
- Botão direto para assistir no YouTube
- Campo de reflexão e intenção da Matriz de Alma com auto-salvamento e sincronização com o Diário Sagrado
- Guia passo a passo do ritual matinal (Respiração, Ativação Verbal e Cristalização)
- Atalho para o Ebook de Mantras

### 3. Prática Noturna: Libere seu Ego Ferido com EFT
- **Vídeo Incorporado**: Sessão prática guiada de EFT (`https://www.youtube.com/watch?v=03G-sYb2PW0`)
- Botão interativo para **Marcar como Concluída**
- Botão direto para assistir no YouTube
- Campo de reflexão noturna (o que foi liberado, perdoado ou dissolvido)
- Guia visual dos 9 pontos fundamentais de toque de EFT Tapping
- Recomendação do ritual de autocuidado com o Banho Energético de Auto Adoçamento

### 4. Biblioteca Sagrada de Estudos
Inclui os dois arquivos PDF originais preservados:
1. `Ebook de Mantras e Ativações em Matriz de Alma para o Programa Portal Sagrado da Prosperidade.pdf` (53 páginas)
2. `Banho Energético Auto Adoçamento.pdf` (4 páginas)
- Alternância rápida entre os documentos através de abas elegantes
- Leitor PDF integrado de alta resolução (780px)
- **Modo Leitura Zen**: Visualização em tela cheia com fundo escuro de foco e tecla ESC para fechar
- Botão para abrir o documento em nova aba
- Botão para baixar o arquivo original mantendo o nome de arquivo idêntico
- Fichas técnicas completas com contagem de páginas, tamanho e resumo temático

### 5. Minha Jornada Diária (Checklist Interativo)
- Seletor de data para navegar entre dias anteriores e futuros
- Checklist matinal interativo:
  - Assistir ativação matinal (Matriz de Alma)
  - Prática dos Mantras de Prosperidade
  - Escrever intenção do dia no diário
- Checklist noturno interativo:
  - Assistir aula noturna de EFT
  - Prática de liberação emocional com EFT
  - Registrar reflexão e gratidão noturna
- Calendário semanal com pílulas de consistência dos últimos 7 dias
- Indicador de dias seguidos de prática (Streak)
- Métricas consolidadas do santuário
- Banner de aviso com instruções sobre armazenamento local

### 6. Diário Sagrado Pessoal
- Formulário intuitivo para registrar:
  - Data do registro
  - Sintonia energética (*Plena & Próspera, Serena, Curando & Soltando, Em Equilíbrio, Conexão Vital*)
  - Intenção e reflexão matinal
  - Reflexão noturna e liberação
  - Insights e revelações
  - Anotações livres
- Histórico completo de entradas com busca instantânea em tempo real por palavra-chave ou data
- Opção para editar ou excluir qualquer entrada com diálogo de confirmação
- **Privacidade total**: dados gravados exclusivamente no navegador
- Exportação e restauração de dados:
  - **Backup JSON**: Salva todo o histórico, checklists e reflexões
  - **Restauração JSON**: Carrega um backup previamente baixado
  - **Exportação TXT**: Gera um arquivo de texto limpo para leitura

---

## ☁️ Como Publicar na Vercel

A pasta `meu-portal-sagrado/` está configurada para deploy estático na Vercel com o arquivo `vercel.json`:

1. **Via Vercel CLI**:
   ```bash
   cd meu-portal-sagrado
   vercel
   ```
2. **Via GitHub / Dashboard da Vercel**:
   - Suba a pasta para o GitHub e importe o repositório na Vercel;
   - Framework Preset: **Other**;
   - Root Directory: `meu-portal-sagrado` (ou raiz caso envie apenas esta pasta);
   - Clique em **Deploy**.

Ao publicar, compartilhe a URL gerada com seus alunos ou participantes. Cada pessoa que acessar terá seu próprio portal isolado e confidencial.

---

## 📁 Estrutura de Arquivos

```
meu-portal-sagrado/
├── index.html                   # Aplicação principal
├── abrir-portal.command         # Inicializador rápido de duplo-clique no Mac
├── vercel.json                  # Configuração de cabeçalhos e deploy na Vercel
├── README.md                    # Manual do santuário
├── css/
│   └── portal.css               # Folha de estilos e design system sagrado
├── js/
│   └── app.js                   # Lógica da aplicação, persistência e áudio
├── docs/                        # Acervo oficial de PDFs
│   ├── Banho Energético Auto Adoçamento.pdf
│   ├── Ebook de Mantras e Ativações em Matriz de Alma...pdf
│   ├── banho-energetico.pdf
│   └── ebook-mantras.pdf
└── assets/                      # Imagens otimizadas e capas
    ├── cover-banho-thumb.webp
    ├── cover-banho.png
    ├── cover-mantras-thumb.webp
    └── cover-mantras.png
```
