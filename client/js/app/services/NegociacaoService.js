import { HttpService } from './HttpService';

export class NegociacaoService {

    constructor() {

        this._http = new HttpService();
    }

    obterNegociacoesDaSemana() {

        return this._http.get('negociacoes/semana').then(negociacoes => {

            console.log(negociacoes);

            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana');
        });
    }

    obterNegociacoesDaSemanaAnterior() {

        return this._http.get('negociacoes/anterior').then(negociacoes => {

            console.log(negociacoes);

            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana anterior');
        });
    }

    obterNegociacoesDaSemanaRetrasada() {

        return this._http.get('negociacoes/retrasada').then(negociacoes => {

            console.log(negociacoes);

            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana retrasada');
        });
    }

    obterNegociacoes() {

        return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(periodos => {

            let negociacoes = periodos.reduce((dados, periodo) => dados.concat(periodo), []);

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    salvar(negociacao) {

        return ConnectionFactory.getConnection().then(conexao => new NegociacaoDao(conexao)).then(dao => dao.adiciona(negociacao)).then(() => 'Negociação cadastrada com sucesso').catch(erro => {
            throw new Error("Não foi possível adicionar a negociação");
        });
    }

    listar() {

        return ConnectionFactory.getConnection().then(connection => new NegociacaoDao(connection)).then(dao => dao.listaTodos()).then(negociacoes => negociacoes).catch(erro => {
            throw new Error("Não foi possível listar as negociações");
        });
    }

    apagar() {

        return ConnectionFactory.getConnection().then(connection => new NegociacaoDao(connection)).then(dao => dao.apagaTodos()).then(() => 'Negociações apagadas com sucesso').catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível apagar as negociações');
        });
    }

    importar(listaAtual) {

        return this.obterNegociacoes().then(negociacoes => negociacoes.filter(negociacao => !listaAtual.some(negociacaoExistente => negociacao.isEquals(negociacaoExistente)))).catch(erro => {
            console.log(erro);
            throw new Error("Não foi possível importar as negociações");
        });
    }
}
//# sourceMappingURL=NegociacaoService.js.map