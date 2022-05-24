//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;


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
        require(address(fractions[tokenId]) == address(0), "Already Fractionalized");
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
