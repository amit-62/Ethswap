const { assert } = require('chai');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

function tokens(n){
    return web3.utils.toWei(n,'ether');
}

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap',([deployer, investor])=>{
    let token, ethSwap

    before(async()=>{
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('Token Deployment', async() =>{
        it('contract has a name', async() =>{
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap Deployment', async() =>{
        it('contract has a name', async() =>{
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        it('contract has tokens', async() =>{
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })

    })

   describe('buyTokens()', async() =>{
        let result
        before(async()=>{
            //beforehook to purchase token
            result = await ethSwap.buyTokens({from: investor, value:web3.utils.toWei('1','ether')})
        })

        it('Allows user to buy token instantly at a fixed price', async() =>{
            //investor's balance after purchase 
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //ethSwap's balance after purchase 
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'))

            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

        })
   })

   describe('buyTokens()', async() =>{
    let result
    before(async()=>{
        //beforehook to purchase token
        
    })

    it('Allows user to sell token instantly at a fixed price', async() =>{

    })
})

})    