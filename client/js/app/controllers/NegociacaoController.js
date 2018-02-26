class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade =  $('#quantidade');
        this._inputValor = $('#valor');

        // Cria um proxy de NegociacoesView
        // para atualizar a view sempre que a lista
        // receber uma nova negociação ou quando a lista
        // for apagada/esvaziada.
        this._listaNegociacoes = ProxyFactory.create (
            new ListaNegociacoes(),
            ['adiciona', 'esvazia'], model =>
                this._negociacoesView.update(model));
        this._negociacoesView = new NegociacoesView($('#negociacoesView'));
        this._negociacoesView.update(this._listaNegociacoes);

        // Cria um proxy para MensagemView
        // para atualizar a view toda vez que o valor
        // da mensagem for alterado.
        this._mensagem = ProxyFactory.create(
            new Mensagem(), ['texto'], model =>
                this._mensagemView.update(model));
        this._mensagemView = new MensagemView($('#mensagemView'));
        this._mensagemView.update(this._mensagem);
    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }

    adiciona(event) {
        
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());

        this._limpaFormulario();
        this._mensagem.texto = 'Negociacao adicionada com sucesso!';
        this._mensagemView.update(this._mensagem);
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0

        this._inputData.focus();
    }

    apaga() {

        this._listaNegociacoes.esvazia();
    
        this._mensagem.texto = 'Negociações apagadas com sucesso!';
        this._mensagemView.update(this._mensagem);
    }

  }