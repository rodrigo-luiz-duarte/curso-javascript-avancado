// Usada a estratégia de função autoinvocável para isolar
// em escopo privado as variáveis e fazendo
// a finção retornar a classe dará o mesmo efeito
// de termos a classe com os métodos estáticos.
// Esse é o padrão de projeto chamado Module Pattern em JS.

var ConnectionFactory = (function() {

    const stores = ['negociacoes'];
    const version = 1;
    const dbName = 'aluraframe';

    let connection = null;
    
    // Variável para guardar a função original close
    // do objeto connection.
    let close = null;
    
    return class ConnectionFactory {
    
        constructor() {
    
            throw new Error('Não é possível criar instâncias de ConnectionFactory');
        }
    
        static getConnection() {
    
            return new Promise((resolve, reject) => {
    
                let openRequest = window.indexedDB.open(dbName, version);
    
                openRequest.onupgradeneeded = e => {
                    ConnectionFactory._createStores(e.target.result);
                };
    
                openRequest.onsuccess = e => {
                    
                    if (!connection) {
                        connection = e.target.result;

                        // Guarda referência para a função close original
                        close = connection.close.bind(connection);

                        // Aplica o padrão Monkey Patch
                        connection.close = function() {
                            throw new Error('Você não pode fechar diretamente a conexão');
                        };
                    }

                    resolve(connection);  
                };
    
                openRequest.onerror = e => { 
                    
                    console.log(e.target.error);
    
                    reject(e.target.error.name);       
                };
            });
        }
    
        static _createStores(connection) {
        
            stores.forEach(store => {
        
                if(connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
                    connection.createObjectStore(store, { autoIncrement: true });
            });
        }

        static closeConnection(){

            if(connection){
                close();
                connection = null;
        
            }
        }
    }
})();
