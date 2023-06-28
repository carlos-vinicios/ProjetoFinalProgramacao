
# Sistema de Análise de Curvas

O escopo deste projeto é a produção de um sistema de visualização e anotação de
curvas de poços de petróleo. O programa deve auxiliar o usuário a visualizar os dados
presentes na base importada, em forma de série temporal. Além da visualização, o programa
deve permitir que o usuário possa fazer anotações categóricas e binárias. As anotações
realizadas podem ser exportadas em formato ".csv", produzindo assim, bases anotadas
para treinamento de modelos supervisionados.

## Frameworks Utilizados

Abaixo está a lista de frameworks utilizadas para o desenvolvimento do projeto:

* [NodeJS: 16.15.1](https://nodejs.org/en)
* [ReactJS: 18.2.0](https://react.dev/)
* [Electron: 25.0.1](https://www.electronjs.org/pt/)
* [Foreman: 3.0.1](https://theforeman.org/)
* [Plotly.js: 1.58.5](https://plotly.com/javascript/)
* [DanfoJS: 1.1.2](https://danfo.jsdata.org/)

## Instalação

A preparação do ambiente é feita através do NPM, que instalará todos os pacotes presentes no
package.json. Portanto, na raiz do projeto execute o seguinte comando:

```
    npm install
```

## Execução

Após instalado todas as dependências do projeto, a inicialização também será realizada através do
NPM:

```
    npm run dev
```

O comando é responsável por inicializar o Foreman, orquestrando a incialização do ReactJS e do Electron e
sincronizando a comunicação entre eles. 

## Mais Informações

Em caso de dúvidas na utilização do sistema, na raiz do projeto encontra-se a pasta "documentation", que contém [manual de utilização do sistema](documentation/final_report.pdf).

Em caso de problemas ou dúvidas que não estejam presentes na documentação, sinta-se livre para abrir uma issue.