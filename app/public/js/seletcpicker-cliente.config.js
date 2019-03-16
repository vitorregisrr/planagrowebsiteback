document.addEventListener("DOMContentLoaded", function() {
$('.selectpicker-cliente')
    .selectpicker({
        liveSearch: true
    })
    .ajaxSelectPicker({
        log: 4,
        ajax: {
            url: '/api/cliente/searchbyajax',
            type: 'GET',
            dataType: 'json',
            data: function () {
                var params = {
                    text: '{{{q}}}'
                };

                return params;
            }
        },

        locale: {
            searchPlaceholder: 'Digite aqui para pesquisar',
            emptyTitle: 'Procurar por cliente...',
            errorText: 'Houve algum erro na pesquisa. Tente novamente ou contate o suporte.',
            statusNoResults: 'Nenhum cliente encontrado com estas letras. Tente outra coisa.',
            statusInitialized: 'Digite uma letra ou nome para iniciar a pesquisa.',
            currentlySelected: 'Selecionado atualmente:'
        },

        preprocessData: function(data){
            var clientes = [];
            console.log(data)
            data.clientes.forEach( cli => {
                clientes.push(
                    {
                        'value': cli._id,
                        'text': cli.nome,
                        'disabled': false
                    }
                );
            })
            return clientes;
        },

        preserveSelected: true
    });
});