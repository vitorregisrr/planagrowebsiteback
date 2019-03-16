document.addEventListener("DOMContentLoaded", function() {
    
    if (document.querySelector('input[name="selectedTipo"]')) {
        const disableTodos = document.querySelector('#selectTipo').getAttribute('data-disableTipo');
        console.log(disableTodos)
        const tipoSelecionado = document.querySelector('input[name="selectedTipo"]').value,
            tiposUrbanos = `<optgroup label="Tipos Urbanos" id="selectUrbano">
                                ${ !disableTodos ? '<option value="">Todos</option>' : '' }
                                <option ${"Casa"==tipoSelecionado?"selected":""} value="Casa">Casa</option>
                                <option ${"Apartamento"==tipoSelecionado?"selected":""} value="Apartamento">Apartamento</option>
                                <option ${"Kitnet"==tipoSelecionado?"selected":""} value="Kitnet">Kitnet</option>   
                                <option ${"Salão Comercial"==tipoSelecionado?"selected":""} value="Salão Comercial">Salão Comercial</option>
                                <option ${"Escritório"==tipoSelecionado?"selected":""} value="Escritório">Escritório</option>
                                <option ${"Terreno"==tipoSelecionado?"selected":""} value="Terreno">Terreno</option>
                                <option ${"Chácara"==tipoSelecionado?"selected":""} value="Chácara">Chácara</option>
                            </optgroup>`,
    
            tiposRurais = `<optgroup label="Tipos Rurais" id="selectRural">
                                ${ !disableTodos ? '<option value="">Todos</option>' : '' }
                                <option ${"Chácara"==tipoSelecionado?"selected":""} value="Chácara">Chácara</option>
                                <option ${"Sítio"==tipoSelecionado?"selected":""} value="Sítio">Sítio</option>  
                                <option ${"Campo"==tipoSelecionado?"selected":""} value="Campo">Campo</option>
                                <option ${"Terreno"==tipoSelecionado?"selected":""} value="Terreno">Terreno</option>
                                <option ${"Lavoura"==tipoSelecionado?"selected":""} value="Lavoura">Lavoura</option>
                            </optgroup>`,
    
            tiposVazio = `<option disabled selected  label="Zona não selecionada"> Tipo de imóvel </option>
                            <optgroup label="Zona não selecionada">
                            <option></option>
                          </optgroup>`;
                          
        setForm = () => {
            switch ($("#inputFiltrando") && $("#inputFiltrando").val($("#selectZona").val()), $("#selectZona").val()) {
                case "todos":
                    $("#selectTipo").html(tiposVazio);
                    break;
                case "Urbana":
                    $("#selectTipo").html(tiposUrbanos), $(".urbano-form").removeClass("hidden"), $(".urbano-form").addClass("visible"), $(".rural-form").removeClass("visible"), $(".rural-form").addClass("hidden");
                    break;
                case "Rural":
                    $("#selectTipo").html(tiposRurais), $(".rural-form").removeClass("hidden"), $(".rural-form").addClass("visible"), $(".urbano-form").removeClass("visible"), $(".urbano-form").addClass("hidden")
            }
            $(".selectpicker").selectpicker("refresh")
        };
        
        setForm(), $("#selectZona").change(setForm)
    }
    $("#selectMunicipio").change(function () {
        "Bagé" == $(this).val() ? ($("#bageLocalidades").removeClass("hidden"), $("#bageLocalidades").addClass("visible")) : $("#bageLocalidades").addClass("hidden")
    });
});