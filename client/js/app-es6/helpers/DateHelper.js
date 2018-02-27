export class DateHelper {

    constructor() {

        throw new Error('Esta classe não pode ser instanciada');
    }
    
    static dataParaTexto(data) {

        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
    }

    static textoParaData(texto) {

        if(!/\d{2}\/\d{2}\/\d{4}/.test(texto)) 
            throw new Error('Data deve estar no formato dd/mm/aaaa');

        // Exemplo de programação funcional em JS.
        // Uso de Arrow Function para decrementar o
        // segundo elemento do array criado a partir
        // do método split.
        // Uso do spread operator (...) para passar cada
        // elemento de um array como cada um dos parâmetros
        // de uma função.
        return new Date(...texto.split('/').reverse().map((item, indice) => item - indice % 2));

    }
}