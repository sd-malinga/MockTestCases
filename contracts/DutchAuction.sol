//SPDX-License-Identifier: Unlicensed
// this contrract is only for the fractional NFTs

pragma solidity ^0.8.0;





import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionsContract is ERC20, Ownable {

    uint256 public DragonId;  //indicates the tokenId whose fraction this contract represent

    constructor(uint256 token) ERC20("DragonFractions", "DF") {
        DragonId = token;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
interface IERC721  {
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    
    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function transfer(address to, uint256 amount) external returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function approve(address to, uint256 tokenId) external;

    function setApprovalForAll(address operator, bool _approved) external;

    function getApproved(uint256 tokenId) external view returns (address operator);

    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}
contract DragonFractionalNFT is ReentrancyGuard{
/* 
 contract address of the NFT Contract which will be used
 */
    IERC721 public dragonNFT;

    /* 
    Mapping of ERC20 contracts that will be the fraction tokens of and to the tokenId
     */
    mapping(uint256 => FractionsContract) public fractions;
    event fractionCreated(
        uint256 indexed tokenId,
        address fractioncontract,
        uint256 fractions
    );
    /* 
    Initializes the Contract
    @param nftAddress is the contract address of NFT Contract
    @dev sets the nft contract
     */
    constructor(IERC721 nftAddress) {
        dragonNFT = nftAddress;
    }
    /* 
    @dev Creates fractions of a given token id
    @dev transfers the token to the contract address
    @dev deploys ERC20 contract and mints ERC20 token
    @param tokenId of the nft 
    @param fracs is the amount of fraction to be made
     */
    function createFractionalNFT(uint256 tokenId, uint256 fracs) external nonReentrant {
        require(address(fractions[tokenId]) == address(0));
        FractionsContract newc = new FractionsContract(tokenId);
        fractions[tokenId] = newc;
        dragonNFT.transferFrom(msg.sender, address(this), tokenId);
        FractionsContract(newc).mint(msg.sender, fracs);
        emit fractionCreated(tokenId, address(newc), fracs);
    }

    /* 
    @return the amount of fractions of a given nft id
     */
    function checkFractionNumber(uint256 tokenId) external view returns(uint256){
        return (FractionsContract(fractions[tokenId]).totalSupply());
    }
    
    /* 
    @return the address of erc20 contract which is the fractional token contract of a given tokenId
     */
    function checkFractionalContract(uint256 tokenId) external view returns(address){
        return(address(fractions[tokenId]));
    }
}


/// @title A contract for dutchAuction
/// @author Somyaditya Deopuria
/// @notice You can use this contract for duction auction of fractional parts (ERC20) tokens of the ERC721 NFT
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.


contract dutchAuction is ReentrancyGuard {
    uint256 auctionId;
    DragonFractionalNFT public fractionMachine;
    
    /* 
    @dev Structure of Auction Item
    @param tokenId: token id of the NFT
    @param amount: Total amount of ERC20 tokens(Fractions of ERC721) to be sold
    @param seller: wallet address of the seller
    @param startingPrice: Price at which the auction will start
    @param discountRate: Rate of the decrement of the price (rate % in hours)
    @param expiresAt: Deadline of the auction
    @param amountsold: Amount of ERC20 tokens that are sold
     */
    struct AuctionItem{
        uint256 tokenId;
        uint256 amount;
        address payable seller;
        uint256 startingPrice; // per token
        uint256 discountRate; //per hour with 2 decimals
        uint256 startAt;
        uint256 expiresAt;
        uint256 amountsold;
    }
    event AuctionCreated(
        uint256 tokenId,
        uint256 amount,
        address payable seller,
        uint256 startingPrice, // per token
        uint256 discountRate, //per hour with 2 decimals
        uint256 startAt,
        uint256 expiresAt
    );
    event Sold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 amount
    );
    mapping(uint256 => AuctionItem) public auctionInfo;

    /* 
    @dev Initializes the contract
    @param splitter, the contract address of the fractional NFT making contract
     */
    constructor(DragonFractionalNFT splitter){
        fractionMachine = splitter;
    }

    /* 
    @dev Creates Auction of the tokenId's amount of fractional part
    @param tokenId: token id of the NFT
    @param amount: Total amount of ERC20 tokens(Fractions of ERC721) to be sold
    @param endTime: Deadline of the auction
    @param startPrice: Price at which the auction will start
    @param discount: Rate of the decrement of the price (rate % in hours)
    @dev Updates the struct of AuctionItem
     */
    function createAuction(uint256 tokenId, uint256 amount, uint256 endTime, uint256 startPrice, uint256 discount) external nonReentrant {
        address conadd = fractionMachine.checkFractionalContract(tokenId);
        require(conadd != address(0), "Fractions Not Present");
        require(endTime> block.timestamp, "End Time must be of future");
        require(discount<=10000, "Discount should be equal to or less than 100%");
        auctionId++;
        IERC20(conadd).transferFrom(msg.sender, address(this), amount);
        auctionInfo[auctionId] = AuctionItem(
            tokenId,
            amount,
            payable (msg.sender),
            startPrice,
            discount,
            block.timestamp,
            endTime,
            0
        );
        emit AuctionCreated(  
            tokenId,
            amount,
            payable (msg.sender),
            startPrice,
            discount,
            block.timestamp,
            endTime
            );

    }
    /* 
        @dev calculates the price of each token according to the time elapsed
        @return the current price of each token of a particular NFT
    */
  function checkPrice(uint256 tokenId) public view returns(uint256) {
        if(block.timestamp - auctionInfo[tokenId].startAt > 3600){
        uint256 timeElapsed = block.timestamp - auctionInfo[tokenId].startAt / (60*60);
        uint256 discount = auctionInfo[tokenId].discountRate * timeElapsed / (100*100);
        return (auctionInfo[tokenId].startingPrice - discount);
        } else return (auctionInfo[tokenId].startingPrice);
    }
    /* 
    @dev checks whether an auction is live or not
    @return the boolean value whether the auction is live or not
     */
   function isAuctionLive(uint256 tokenId) public view returns(bool){
        if(
            auctionInfo[tokenId].expiresAt > block.timestamp && 
            auctionInfo[tokenId].amountsold < auctionInfo[tokenId].amount) 
            {
            return true;
            }
        else 
            {
                return false;
            }
    }

    /* 
    @dev buys the amount of token 
    @param tokenId: NFT token id of which parts are being bought
    @param amount: amount of tokens (fractional parts that are being bought
    @dev transfers the appropriate value of the amount of tokens from msg.sender to seller
    @dev transfers the amount of tokens that are being sold to the buyer (msg.sender)
     */

    function buyNow(uint256 tokenId, uint256 amount) external nonReentrant payable {
        require(isAuctionLive(tokenId)==true, "Already Sold or Ended");
        address conadd = fractionMachine.checkFractionalContract(tokenId);
        uint256 price = amount * checkPrice(tokenId);
        require(msg.value==price, "Send correct Amount in Value");
        auctionInfo[tokenId].seller.transfer(msg.value);
        auctionInfo[tokenId].amountsold += amount;
        IERC20(conadd).transfer(msg.sender, amount);
        emit Sold(
            tokenId,
            msg.sender,
            amount
        );
    }

 

}
