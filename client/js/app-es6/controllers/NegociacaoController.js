import { ListaNegociacoes } from '../models/ListaNegociacoes';
import { Mensagem } from '../models/Mensagem';
import { NegociacoesView } from '../views/NegociacoesView';
import { MensagemView } from '../views/MensagemView';
import { NegociacaoService } from '../services/NegociacaoService';
import { DateHelper } from '../helpers/DateHelper';
import { Bind } from '../helpers/Bind';
import { Negociacao } from '../models/Negociacao'; 
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade =  $('#quantidade');
        this._inputValor = $('#valor');

        // Cria um proxy de NegociacoesView
        // para atualizar a view sempre que a lista
        // receber uma nova negociação (método adiciona) ou quando a lista
        // for apagada ou esvaziada (método esvazia).
        this._listaNegociacoes = new Bind (
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordena', 'inverteOrdem');

        // Cria um proxy para MensagemView
        // para atualizar a view toda vez que o valor
        // da mensagem for alterado.
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto');
        
        this._ordemAtual = '';

        this._negociacaoService = new NegociacaoService();

        this._init();
    }

    _init() {

        this._listaTodos();

        setInterval(() => {
            this.importaNegociacoes();
        }, 3000);

    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    adiciona(event) {
        
        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._negociacaoService
            .salvar(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem; 
                this._limpaFormulario();  
            }).catch(erro => this._mensagem.texto = erro);
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0

        this._inputData.focus();
    }

    apaga() {

        this._negociacaoService
            .apagar()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    importaNegociacoes() {

        this._negociacaoService
            .importar(this._listaNegociacoes.negociacoes)
            .then(negociacoes => negociacoes.forEach(negociacao => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = 'Negociações do período importadas'
            }))
            .catch(erro => this._mensagem.texto = erro);
    }

    ordena(coluna) {

        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);    
        }

        this._ordemAtual = coluna;
    }

    _listaTodos() {

        this._negociacaoService
            .listar()
            .then(negociacoes => negociacoes.forEach(negociacao =>
                this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => this._mensagem.texto = erro);
    }

}

let negociacaoController = new NegociacaoController();

export function currentInstance() {

    return negociacaoController;

}