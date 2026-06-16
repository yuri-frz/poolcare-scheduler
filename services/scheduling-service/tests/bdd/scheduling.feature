Feature: Agendamento

  Scenario: Cliente agenda visita com sucesso
    Given um cliente autenticado
    When solicita um agendamento
    Then o sistema deve registrar a visita

  Scenario: Cliente consulta seus agendamentos
    Given um cliente com agendamento criado
    When consulta seus agendamentos
    Then o sistema deve listar a visita criada

  Scenario: Cliente cancela agendamento
    Given um cliente com agendamento criado
    When cancela o agendamento
    Then o sistema deve marcar a visita como cancelada

  Scenario: Prestador confirma atendimento
    Given um prestador com atendimento solicitado
    When confirma o atendimento
    Then o sistema deve marcar a visita como confirmada

  Scenario: Prestador conclui atendimento
    Given um prestador com atendimento confirmado
    When conclui o atendimento
    Then o sistema deve registrar a visita como concluida

  Scenario: Prestador consulta historico
    Given um prestador com atendimento concluido
    When consulta a propria agenda
    Then o sistema deve exibir o historico de atendimentos

  Scenario: Cliente nao cancela atendimento de outro cliente
    Given um agendamento pertencente a outro cliente
    When tenta cancelar o agendamento
    Then o sistema deve negar o cancelamento
