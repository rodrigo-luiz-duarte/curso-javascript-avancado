class Bind {

    // props é um REST parameter,
    // semelhante ao SPREAD operator
    constructor(model, view, ...props) {

        let proxy = ProxyFactory.create(model, props, model => {
            view.update(model);
        });

        view.update(model);

        // Bizarro, mas conveniente realizar o retorno
        // do Proxy no construtor do Bind.
        // Só é possível porque o Javascript permite esse tipo de bizarrice.  
        return proxy;
    }
}
//# sourceMappingURL=Bind.js.map