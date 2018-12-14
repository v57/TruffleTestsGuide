const Auction = artifacts.require('Auction');

contract('AuctionTests', async(accounts) => {
  let auction;

  beforeEach(async function () {
    auction = await Auction.new();
  });

  it('should allow to start auction', async() => {
    await auction.auction('1')
  });

  it('should allow to make multiple bids', async() => {
    await auction.auction('1')
    await auction.bid({from: accounts[1], value: '2'});
    await auction.bid({from: accounts[2], value: '3'});
    await auction.bid({from: accounts[1], value: '4'});
    await auction.finishAuction();
  })
  it('should not let non contract owner to finish auction', async() => {
    await auction.auction('1', {from: accounts[1]})
    await auction.bid({from: accounts[1], value: '2'});
    await auction.bid({from: accounts[2], value: '3'});
    await auction.bid({from: accounts[1], value: '4'});
    await assertRevert(auction.finishAuction({from: accounts[1]}));
    await assertRevert(auction.finishAuction({from: accounts[2]}));
    await assertRevert(auction.finishAuction({from: accounts[5]}));
    await auction.finishAuction({from: accounts[0]});
  });
  it('should finish auction with only one bid', async() => {
    await auction.auction('100');
    await auction.bid({from: accounts[1], value: '110'})
    await auction.finishAuction();
  })
  it('should revert when bidding less than previous bid', async() => {
    await auction.auction('100');
    await assertRevert(auction.bid({value: '99'}));
  })
})

async function assertRevert (promise) {
    try {
        await promise;
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
        return;
    }
    assert.fail('Expected revert not received');
}
