Feature: Autenticacao

  Scenario: Cliente cria conta com sucesso
    Given um visitante com dados validos
    When solicita o cadastro como cliente
    Then o Auth Service deve criar a conta

  Scenario: Usuario realiza login com sucesso
    Given um usuario cadastrado
    When informa credenciais corretas
    Then o Auth Service deve retornar um JWT

  Scenario: Login com senha invalida
    Given um usuario cadastrado
    When informa senha incorreta
    Then o Auth Service deve negar o acesso
