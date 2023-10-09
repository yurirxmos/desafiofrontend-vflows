// Preenchimento do endereço automático usando a API via CEP
$(document).ready(function () {
    $("#cep").blur(function () {
        const cep = $(this).val().replace(/\D/g, "");

        if (cep.length !== 8) {
            return;
        }

        $.get(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
            if (data.erro) {
                alert("O CEP inserido não foi encontrado.");
            } else {
                $("#endereco").val(data.logradouro);
                $("#bairro").val(data.bairro);
                $("#municipio").val(data.localidade);
                $("#estado").val(data.uf);
            }
        })
            .fail(function () {
                console.error("Erro ao buscar o CEP.");
            });
    });
});

// Função para formatar o CNPJ com pontuações
$(document).ready(function () {
    function formatCnpj(cnpj) {
        cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    // Função para validar o CNPJ
    function validarCnpj(cnpj) {
        cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cnpj.length !== 14) {
            return false;
        }

        // Verificação de dígitos verificadores
        const digitos = cnpj.split('');
        const tamanho = digitos.length - 2;
        let numeros = digitos.slice(0, tamanho);
        const digitosVerificadores = digitos.slice(tamanho);

        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros[tamanho - i] * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        if (resultado !== parseInt(digitosVerificadores[0])) {
            return false;
        }

        tamanho += 1;
        numeros = digitos.slice(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros[tamanho - i] * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        return resultado === parseInt(digitosVerificadores[1]);
    }

    // Adiciona a formatação e validação do CNPJ ao campo
    $("#cnpj").on("blur", function () {
        let cnpj = $(this).val();
        cnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cnpj.length !== 14) {
            alert("CNPJ deve conter 14 números.");
            $(this).val(""); // Limpa o campo se o CNPJ for inválido
            return;
        }

        if (!validarCnpj(cnpj)) {
            alert("CNPJ inválido.");
            $(this).val(""); // Limpa o campo se o CNPJ for inválido
            return;
        }

        // Formata o CNPJ com pontuações
        const cnpjFormatado = formatCnpj(cnpj);
        $(this).val(cnpjFormatado);
    });
});


// Função para formatar o número de telefone
$(document).ready(function () {
    function formatPhoneNumber(phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove caracteres não numéricos
        const regex = /^(\d{2})(\d{1})(\d{4})(\d{4})$/; // Regex para o padrão (XX) X XXXX-XXXX

        if (regex.test(phoneNumber)) {
            return phoneNumber.replace(regex, '($1) $2 $3-$4');
        }

        return phoneNumber; // Retorna o número sem formatação se não corresponder ao padrão
    }

    // Aplica a formatação e impede a entrada de mais de 11 dígitos enquanto o usuário digita
    $("#telefone").on("input", function () {
        let phoneNumber = $(this).val();
        phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (phoneNumber.length > 11) {
            phoneNumber = phoneNumber.slice(0, 11); // Limita a entrada a 11 dígitos
        }

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        $(this).val(formattedPhoneNumber);
    });
});


// Função para validar o formato do e-mail
$(document).ready(function () {
    function isValidEmail(email) {
        const regex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return regex.test(email);
    }

    $("#email").on("input", function () {
        const email = $(this).val();
        const isValid = isValidEmail(email);

        if (!isValid) {
            $(this).addClass("is-invalid"); // Adiciona classe de inválido
        } else {
            $(this).removeClass("is-invalid"); // Remove classe de inválido
        }
    });
});



// Função para Produtos
$(document).ready(function () {
    function atualizarContador() {
        $(".produto").each(function (index) {
            $(this).find("#produto-contador").text("Produto - " + (index + 2));
        });
    }

    // Função para adicionar um novo produto
    function adicionarProduto() {

        const novoProduto = $("#produto-conteudo").clone();
        novoProduto.find("input").val("");
        novoProduto.removeAttr("id");
        novoProduto.addClass("produto");

        $("#listaProdutos").append(novoProduto);
        atualizarContador();
    }

    $("#adicionarProduto").click(function () {
        adicionarProduto();
    });

    $(document).on("click", ".excluir-produto", function () {
        if ($(this).closest(".produto").length > 0) {
            $(this).closest(".produto").remove();
            // Atualize o contador de produtos após a exclusão
            atualizarContador();
        }
    });

    // Evento de exclusão para o primeiro produto
    $("#deletar-coluna").click(function () {
        if ($(".produto").length > 1) {
            $(".produto").first().remove();
            atualizarContador();
        } else {
            alert("É necessário ter pelo menos o Produto 1.");
        }
    });
});

// Cálculo e preenchimento do Valor Total
