//módulos externos
const inquirer = require("inquirer");
const chalk = require("chalk");

//módulos internos
const fs = require("fs");
const { parse } = require("path");

operation()

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']
      
      if (action === 'Criar Conta') {
        creatAccount()
      }else if (action === 'Depositar') {
        deposit ()
      }else if (action === 'Consultar Saldo') {
        getAccountBalance ()
      }else if (action === 'Sacar') {
        withdraw()
      }else if (action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigado por usar o conta-banco'))
        process.exit()

      }

      

    })
    .catch((err) => console.log(err));
}

// criação de conta 

function creatAccount() {
  console.log (chalk.bgGreen.black('Parabéns por escolher nosso banco'))
  console.log (chalk.green('Defina as opções da sua conta a seguir'))

builAccount()
return
}

// metódo para criação de conta "function -builAccount"
function builAccount () {

inquirer.prompt([
  {
    name: 'accountName',
    message: 'Digite um nome para sua conta:'
  }
]).then((answer) => {
  const accountName = answer['accountName']
//criação de conta, caso não exista ela será criada.
  console.info(accountName)
  if(!fs.existsSync('accounts')) {
    fs.mkdirSync('accounts')
  }
//validação de conta existente
if(fs.existsSync(`accounts/${accountName}.json`)){
  console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
  )
  builAccount ()
}
//padrões j.son, registro no banco de dados
fs.writeFileSync(`accounts/${accountName}.json`,'{"balance": 0}', function (err) {
  console.log(err)
  },
)
console.log(chalk.green('Parabéns, a sua conta foi criada!'))
operation() //escolher a próxima seção, simulando um caixa eletrônico

}) .catch((err) => console.log(err))

}
// adicionar um montante à conta de utilizador
function deposit() {
  inquirer.prompt([
    { 
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }

  ])
  .then((answer) => {

    const accountName = answer['accountName']

    //verificar se a conta é existente
     if (!checkAccount(accountName)) {
      return deposit() 
    }
    inquirer.prompt([
      {
      name:'amount',
      message:'Quanto você deseja depositar',
      },
    ]).then((answer) => {
      const amount = answer['amount']

      //adicionar o montande a conta-banco
      addAmount(accountName, amount)
      operation()




    }).catch(err => console.log(err))
  })
  .catch((err) => console.log(err))
}

function checkAccount(accountName) {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'))
    return false
  }
  return true
}

function addAmount(accountName, amount) {
 const accountData = getAccount(accountName) 
 if(!amount) {
  console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
  )
  return deposit()
 }
 accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

 fs.writeFileSync(`accounts/${accountName}.json`,
 JSON.stringify(accountData),
 function(err) {
  console.log(err)
 },
 
 )
 console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`),
 )
 
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding:'utf8',
    flag:'r'

  })
  return JSON.parse(accountJSON)
}

// mostrar o saldo da conta
function getAccountBalance() {
  inquirer.prompt ([
    {
      name:'accountName',
      message:'Qual nome da sua conta?'
    }
  ]).then((answer) => {
    const accountName = answer ["accountName"]
    //verificar se a conta existe 
    if(!checkAccount(accountName)) {
      return getAccountBalance ()
    }
    const accountData = getAccount(accountName)

    console.log(chalk.bgBlue.black(
      `Olá, o saldo da sua conta é de R$${accountData.balance}`,

    ),
    )
    operation()
    
  }).catch(err => console.log(err))
}

// sacar o valor da conta do usuário
function withdraw () {
  inquirer.prompt([
    {
      name:'accountName',
      message:'Qual o nome da sua conta?'
    }

  ]).then((answer) => {
    const accountName = answer['accountName']

    if(!checkAccount(accountName)) {
      return withdraw ()
  }

  inquirer.prompt([
    {
      name:'amount',
      message:'Quanto você deseja sacar?'
    }
  ]).then((answer) => {
    const amount = answer['amount']

    removeAmount(accountName, amount)
    
  })

  .catch(err => console.log(err))
  
})
.catch(err => console.log(err))

}

function removeAmount (accountName, amount) {
  const accountData = getAccount(accountName)
  if(!amount) {
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))
  
  }
  if(accountData.balance < amount) {

     console.log(chalk.bgRed.black('Valor indisponível!'))

     return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
  fs.writeFileSync(
    `accounts/${accountName}.json`,
  JSON.stringify(accountData),
  function (err) {
    console.log(err)
},
  )
  console.log(chalk.green('Foi realizado um saque de R$${amount} da sua conta'),
  )
  operation()
}