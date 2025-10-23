/// <reference types="cypress" />
import contrato from '../contratos/usuarios.contrato'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {


  it('Deve validar contrato de usuários', () => {
    cy.api('usuarios').then(res => {
      return contrato.validateAsync(res.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.api({
      method: 'GET',
      url: 'usuarios'
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.usuarios[0].nome).to.eq('Fulano da Silva')
      expect(res.body.usuarios[0].email).to.equal("fulano@qa.com")

    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = faker.name.firstName();
    let email = faker.internet.email();
    cy.api({
      method: 'POST',
      url: 'usuarios',
      body: {
        nome: usuario,
        email: email,
        password: "teste",
        administrador: "true"
      },

    }).then((res) => {
      expect(res.status).to.equal(201)
      expect(res.body.message).to.equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.api({
      method: 'GET',
      url: 'usuarios'
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.usuarios[0].nome).to.eq('Fulano da Silva')
      expect(res.body.usuarios[0].email).to.equal("fulano@qa.com")

    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = faker.name.firstName();
    let email = faker.internet.email();
    cy.cadastrarUsuario(nome, email)
      .then(res => {
        let id = res.body._id
        cy.api({
          method: 'PUT',
          url: `usuarios/${id}`,
          body:
          {
            nome: nome,
            email: email,
            password: "teste",
            administrador: "true",
          }
        }).then(res => {
          expect(res.status).to.eq(200)
          expect(res.body.message).to.equal('Registro alterado com sucesso')
        })
      })
  })


  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = faker.name.firstName();
    let email = faker.internet.email();
    cy.cadastrarUsuario(nome, email)
      .then(res => {
        let id = res.body._id
        cy.api({
          method: 'DELETE',
          url: `usuarios/${id}`,
        }).then(res => {
          expect(res.body.message).to.equal('Registro excluído com sucesso')
          expect(res.status).to.equal(200)

        })
      })
  })
})




