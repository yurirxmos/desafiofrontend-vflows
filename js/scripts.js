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
        let tamanho = digitos.length - 2;
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
    let contadorProdutos = 0;

    function calcularValorTotal($produto) {
        const $qtdEstoque = $produto.find(".qtdEstoque");
        const $valorUnitario = $produto.find(".valorUnitario");
        const $valorTotal = $produto.find(".valorTotal");

        const quantidade = parseInt($qtdEstoque.val()) || 0;
        const valorUnitario = parseFloat($valorUnitario.val()) || 0;

        const valorTotal = quantidade * valorUnitario;

        $valorTotal.val(valorTotal.toFixed(2));
    }

    function calcularValorTotalTodosProdutos() {
        $(".produto").each(function () {
            calcularValorTotal($(this));
        });
    }

    function adicionarNovoProduto() {
        contadorProdutos++;

        const novoProduto = `
        <div class="row produto" id="produto-conteudo-${contadorProdutos}">
          <div class="col-auto deletar-coluna">
            <img src="./img/trash.png" class="excluir-produto" />
          </div>
  
          <div class="col produto-container">
            <div class="row">
              <p class="produto-contador">Produto - ${contadorProdutos}</p>
              <div class="col-auto produto-coluna">
                <img src="./img/product.png" />
              </div>
              <div class="col">
                <label for="produto" class="form-label">Produto</label>
                <input
                  type="text"
                  class="form-control"
                  id="produto"
                  name="produto"
                  required
                />
                <div class="row">
                  <div class="col">
                    <label for="undMedida" class="form-label">UND. Medida</label>
                      <select class="form-select" id="undMedida" name="undMedida" required>
                        <option value="" disabled selected></option>
                        <option value="Unidade">Unidade</option>
                        <option value="Quilograma">Quilograma</option>
                        <option value="Litro">Litro</option>
                        <option value="Metro">Metro</option>
                      </select>
                    </div>
                  <div class="col">
                    <label for="qtdEstoque" class="form-label">QTD. em Estoque</label>
                    <input
                      type="number"
                      class="form-control qtdEstoque"
                      name="qtdEstoque"
                      required
                    />
                  </div>
                  <div class="col">
                    <label for="valorUnitario" class="form-label">Valor Unitário</label>
                    <input
                      type="number"
                      class="form-control valorUnitario"
                      name="valorUnitario"
                      required
                    />
                  </div>
                  <div class="col">
                    <label for="valorTotal" class="form-label">Valor Total</label>
                    <input
                      type="text"
                      class="form-control valorTotal"
                      name="valorTotal"
                      disabled
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

        $("#listaProdutos").append(novoProduto);

        const $novoProduto = $(`#produto-conteudo-${contadorProdutos}`);
        calcularValorTotal($novoProduto);
    }

    // Adicionar um produto inicial quando o site for carregado
    adicionarNovoProduto();

    $("#adicionarProduto").click(function () {
        adicionarNovoProduto();
    });

    // Evento de exclusão para produtos
    $(document).on("click", ".excluir-produto", function () {
        const $produtoExcluido = $(this).closest(".produto");

        // Verifique se há mais de um produto antes de permitir a exclusão
        if ($(".produto").length > 1) {
            $produtoExcluido.remove();

            $(".produto").each(function (index) {
                $(this).find(".produto-contador").text(`Produto - ${index + 1}`);
                $(this).attr("id", `produto-conteudo-${index + 1}`);
            });

            contadorProdutos--;
        } else {
            // Limpar os campos do primeiro produto apenas se houver mais de um produto
            $produtoExcluido.find("input").val("");
        }

        calcularValorTotalTodosProdutos();
    });

    // Evento de cálculo automático ao editar os campos
    $(document).on("input", ".qtdEstoque, .valorUnitario", function () {
        const $produto = $(this).closest(".produto");
        calcularValorTotal($produto);
    });
});












$(document).ready(function () {
    let contadorAnexos = 0;

    // Evento para carregar o arquivo e adicioná-lo à lista de anexos
    $("#incluirAnexo").click(function () {
        contadorAnexos++;

        const novoAnexo = `
            <div class="row anexo align-items-end" id="anexo-conteudo-${contadorAnexos}">
                <div class="col-auto">
                    <input type="file" class="arquivo-input" id="arquivoInput${contadorAnexos}" style="display: none;" />
                </div>
            </div>
        `;

        $("#listaAnexo").append(novoAnexo);

        // Evento para carregar o nome do arquivo após a seleção
        $(`#arquivoInput${contadorAnexos}`).change(function () {
            const $anexo = $(this).closest(".anexo");
            const nomeArquivo = this.files[0].name;

            // Adicionar botões de excluir e visualizar, juntamente com o nome do arquivo
            const botoesENome = `
                <div class="col-auto">
                    <button type="button" class="btn btn-light excluir-anexo">
                        <img src="/img/trash.png">
                    </button>
                </div>
                <div class="col-auto">
                    <a href="#" class="btn btn-light visualizar-anexo">
                        <img src="/img/eye.png">
                    </a>
                </div>
                <div class="col-auto">
                    <p class="nome-arquivo">${nomeArquivo}</p>
                </div>
            `;
            $anexo.append(botoesENome);

            // Evento de exclusão para anexos
            $anexo.find(".excluir-anexo").click(function () {
                $anexo.remove();
            });

            // Evento de visualização para anexos (você pode implementar a funcionalidade de download aqui)
            $anexo.find(".visualizar-anexo").click(function (e) {
                e.preventDefault();
                const arquivoInput = $anexo.find(".arquivo-input")[0];
                if (arquivoInput.files.length > 0) {
                    const arquivo = arquivoInput.files[0];
                    const url = URL.createObjectURL(arquivo);

                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.download = arquivo.name;
                    link.click();
                } else {
                    console.log("Nenhum arquivo carregado para este anexo.");
                }
            });
        });

        $(`#arquivoInput${contadorAnexos}`).trigger("click");
    });
});







// Função para montar o JSON com os dados do fornecedor e produtos
function montarJSON() {
    const jsonFornecedor = {
        razaoSocial: $("#razaoSocial").val(),
        nomeFantasia: $("#nomeFantasia").val(),
        cnpj: $("#cnpj").val(),
        inscricaoEstadual: $("#inscricaoEstadual").val(),
        inscricaoMunicipal: $("#inscricaoMunicipal").val(),
        nomeContato: $("#nomeContato").val(),
        telefoneContato: $("#telefoneContato").val(),
        emailContato: $("#emailContato").val(),
        produtos: [],
        anexos: []
    };

    // Preenchendo os produtos
    $(".produto").each(function (index) {
        const $produto = $(this);
        const produtoObj = {
            indice: index + 1,
            descricaoProduto: $produto.find("input[name='produto']").val(),
            unidadeMedida: $produto.find("select[name='undMedida']").val(),
            qtdeEstoque: $produto.find("input[name='qtdEstoque']").val(),
            valorUnitario: $produto.find("input[name='valorUnitario']").val(),
            valorTotal: $produto.find("input[name='valorTotal']").val()
        };
        jsonFornecedor.produtos.push(produtoObj);
    });

    $(".anexo").each(function (index) {
        const $anexo = $(this);
        const arquivoInput = $anexo.find(".arquivo-input")[0];

        if (arquivoInput.files.length > 0) {
            const arquivoBlob = arquivoInput.files[0];

            const anexoObj = {
                indice: index + 1,
                nomeArquivo: arquivoBlob.name
            };

            anexoObj.blobArquivo = arquivoBlob;
            jsonFornecedor.anexos.push(anexoObj);
        }
    });

    return jsonFornecedor;
}

// Função para criar um arquivo JSON a partir do objeto e fazer o download
function downloadJSON(jsonData, filename) {
    const json = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename || "dados.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Evento para salvar o fornecedor
$("#salvarFornecedor").click(function () {
    const formulario = document.querySelector(".form-dados");

    // Verifique a validade do formulário (Campos obrigatórios)
    if (formulario.checkValidity()) {
        // Exibir o modal de loading
        $("#loadingModal").modal("show");

        const jsonFornecedor = montarJSON();

        setTimeout(function () {
            $("#loadingModal").modal("hide");

            downloadJSON(jsonFornecedor);
        }, 3000);

    } else {
        alert("Por favor, preencha todos os campos obrigatórios corretamente.");
    }
});
