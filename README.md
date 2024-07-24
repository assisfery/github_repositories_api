# GitHub Repositories API
Projeto simples para explorar APIs do Github utilizando o NestJS.

## Configurar o projeto

1. Clonar o projeto
```
git clone https://github.com/assisfery/github_repositories_api.git
```

2. Criar o ficheiro .env
```
cp .env.example .env
```

3. Rodar utilizando o docker
```
docker compose up
```

4. Acessar o API
```
http://localhost:3000
```

5. Acessar o pgadmin e usar as seguintes credenciais.

**Email:** admin@admin.com

**Palavra passe:** root
```
http://localhost:5050/login
```

COnfigurar um servidor:
- Aceder ao Menu Object
- Escoher o Register >> Server
- Configurar com os seguintes dados
  - Host name/address: db
  - User name: root
  - Password: root


<br/><br/>

## APIs

1. Copiar para uma base de dados local, todos os repositórios públicos de um determinado utilizador do GitHub
```
GET {{url}}/users/:user/repos/import
```

2. Receber o nome de um determinado utilizador e listar todos os seus repositórios, que estão armazenados na base de dados local.

```
GET {{url}}/users/:user/repos
```
Podes usar o seguintes querystring como filtro **skip, take, name, description** e **language**

<br/><br/>

## Postman

Pode utilizar o postman para testar o projeto, as **collections** e os **environments** estão dentro do diretório postman na raiz do projeto.

