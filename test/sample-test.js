const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestCases", function () {
  it("Checking All the deployments", async function () {
    const GameItem = await ethers.getContractFactory("GameItem");
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");

    const gameItem = await GameItem.deploy();
    await gameItem.deployed();

    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();

    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();




  });
  it("Checking NFT Minting", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    expect(await gameItem.name()).to.equal("GameItem");
    expect(await gameItem.symbol()).to.equal("ITM");

    await gameItem.awardItem(accounts[0].address);
    expect((await gameItem.ownerOf(1))).to.equal(accounts[0].address);

  });

  it("Checking Dutch Auction Contract", async function () {
    const accounts = await hre.ethers.getSigners();
    const acc = accounts[0].address
    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();

    expect((await fractional.dragonNFT())).to.equal(gameItem.address);

  });

  it("Checking Fractional Contract", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");

    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();

    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();

    expect((await dauction.fractionMachine())).to.equal(fractional.address);

  });


  it("Fractionalizing NFT", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");

    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();

    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();


    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    expect(await gameItem.ownerOf(1)).to.equal(fractional.address);
    expect(await fractional.checkFractionNumber(1)).to.equal(fractions);
  });
  it("Checking Duplicate Fractionalizing NFT", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");

    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();

    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();


    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    expect(await gameItem.ownerOf(1)).to.equal(fractional.address);
    expect(await fractional.checkFractionNumber(1)).to.equal(fractions);
    await expect( fractional.createFractionalNFT(1, fractions )).to.be.revertedWith('Already Fractionalized');

  });

 
  it("Checking Fractional Contract Mapping", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid_frac = await fraccontract.DragonId();

    expect(tokenid_frac).to.equal(1);

  });
  
  it("Checking NFT Fractional Contract", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );


    expect(await fraccontract.totalSupply()).to.equal(fractions);

  });
  it("Checking Balance of Fractions Part", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    expect(await fraccontract.balanceOf(accounts[0].address)).to.equal(fractions);

  });


  it("Creating Dutch Auction", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const endtime = parseInt(new Date()/1000) + 160000 ; //deadline of auction
    const startprice = 1; //start price of auction
    const discount = 10; //discount rate per hour
  
    const approval = await fraccontract.approve(dauction.address, fractions);
    await dauction.createAuction(tokenid, amt, endtime, startprice, discount);

  });

  it("Checking Auction Item", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const endtime = parseInt(new Date()/1000) + 160000 ; //deadline of auction
    const startprice = 1; //start price of auction
    const discount = 10; //discount rate per hour
  
    const approval = await fraccontract.approve(dauction.address, fractions);
    await dauction.createAuction(tokenid, amt, endtime, startprice, discount);

    const auctioninfo = await dauction.auctionInfo(1);
   
    expect(auctioninfo.tokenId).to.equal(tokenid);
    expect(auctioninfo.seller).to.equal(accounts[0].address);
    expect(auctioninfo.startingPrice).to.equal(startprice);
    expect(auctioninfo.expiresAt).to.equal(endtime);
    expect(auctioninfo.amountsold).to.equal(0);
    expect(auctioninfo.discountRate).to.equal(discount);



  });

  
  it("Checking Status of Auction Item", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const endtime = parseInt(new Date()/1000) + 160000 ; //deadline of auction
    const startprice = 1; //start price of auction
    const discount = 10; //discount rate per hour
  
    const approval = await fraccontract.approve(dauction.address, fractions);
    await dauction.createAuction(tokenid, amt, endtime, startprice, discount);

    const status = await dauction.isAuctionLive(tokenid);
    expect(status).to.equal(true);
  });

  it("Checking Price of Auction Item", async function () {

    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const startprice = 1; //start price of auction
    const discount = 5000; //discount rate per hour
    const endtime = parseInt(new Date()/1000) + 16000 ; //deadline of auction

    const approval = await fraccontract.approve(dauction.address, fractions);

    const cauc = await dauction.createAuction(tokenid, amt, endtime, startprice, discount);
    const pr = await dauction.checkPrice(tokenid);
        expect(pr).to.equal(startprice)
      //  expect(await dauction.auctionInfo(tokenid).amountsold).to.equal(amt);
  });

  it("Buying of Auction Item", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const startprice = 1; //start price of auction
    const discount = 10; //discount rate per hour
    const endtime = parseInt(new Date()/1000) + 16000 ; //deadline of auction

    const approval = await fraccontract.approve(dauction.address, fractions);
    const cauc = await dauction.createAuction(tokenid, amt, endtime, startprice, discount);
    const beforebalance = await fraccontract.balanceOf(accounts[0].address);
    
    const buy = await dauction.buyNow(tokenid, 100000, {value: 100000});
    const afterbalance = await fraccontract.balanceOf(accounts[0].address);
    const aucinfo = await dauction.auctionInfo(1);

    expect(afterbalance - beforebalance).to.equal(100000)
    expect(aucinfo.amountsold).to.equal(100000);

  });
  it("After Sale Balance of Auction Contract", async function () {
    const accounts = await hre.ethers.getSigners();

    const GameItem = await ethers.getContractFactory("GameItem");
    const gameItem = await GameItem.deploy();
    await gameItem.deployed();
    const DragonFractionalNFT = await ethers.getContractFactory("contracts/fractional.sol:DragonFractionalNFT");
    const dutchAuction = await ethers.getContractFactory("contracts/DutchAuction.sol:dutchAuction");
    const fractional = await DragonFractionalNFT.deploy(gameItem.address);
    await fractional.deployed();
    const dauction = await dutchAuction.deploy(fractional.address);
    await dauction.deployed();
    await gameItem.awardItem(accounts[0].address);
    await gameItem.approve(fractional.address, 1);
    /* globals BigInt */  
    const fractions = BigInt(10000000000000000000000000000);
    await fractional.createFractionalNFT(1, fractions );
    const fractionsaddress = fractional.checkFractionalContract(1);
    const FractionsContract = await ethers.getContractFactory("contracts/SampleERC20.sol:FractionsContract");
    const fraccontract = await FractionsContract.attach(
       fractionsaddress
    );

    const tokenid = 1; //token for auction
    const amt = fractions; //no of tokens to be auctioned
    const startprice = 1; //start price of auction
    const discount = 10; //discount rate per hour
    const endtime = parseInt(new Date()/1000) + 16000 ; //deadline of auction

    const approval = await fraccontract.approve(dauction.address, fractions);
    const cauc = await dauction.createAuction(tokenid, amt, endtime, startprice, discount);
    const beforebalance = await fraccontract.balanceOf(dauction.address);
    
    const buy = await dauction.buyNow(tokenid, 100000, {value: 100000});
    const aucinfo = await dauction.auctionInfo(1);

    expect(aucinfo.amountsold).to.equal(100000);

  });
  
 

});


