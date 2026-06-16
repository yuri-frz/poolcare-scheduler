Feature: Notificacoes

  Scenario: Sistema envia notificacao simulada
    Given uma mensagem de notificacao valida
    When o Notification Service processa a mensagem
    Then um log de envio deve ser criado

  Scenario: Prestador consulta logs de notificacao
    Given uma notificacao enviada para um usuario
    When consulta os logs desse usuario
    Then o Notification Service deve retornar o historico
