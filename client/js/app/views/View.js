class View {

    constructor(elemento) {

          this._elemento = elemento;
    }

    // Obriga as classes filhas a implementarem o método
    // para que o uso do método update seja possível.
    template() {
        throw new Error('O método template deve ser implementado');
    }

    update(model) {

        this._elemento.innerHTML = this.template(model);
    }
}