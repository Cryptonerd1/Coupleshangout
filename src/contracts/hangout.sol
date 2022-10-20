// SPDX-License-Identifier: MIT 
 
pragma solidity >=0.7.0 <0.9.0; 
 
import "@openzeppelin/contracts/utils/Counters.sol";
interface IERC20Token { 
  function transfer(address, uint256) external returns (bool); 
  function approve(address, uint256) external returns (bool); 
  function transferFrom(address, address, uint256) external returns (bool); 
  function totalSupply() external view returns (uint256); 
  function balanceOf(address) external view returns (uint256); 
  function allowance(address, address) external view returns (uint256); 
 
 
  event Transfer(address indexed from, address indexed to, uint256 value); 
  event Approval(address indexed owner, address indexed spender, uint256 value); 
} 
 
 
contract Coupleshangout { 
 
    using Counters for Counters.Counter;
    Counters.Counter hangoutLength;

    address internal constant cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; 
 
 
    // declaring the struct for the review 
     struct Review { 
        uint256 postId; 
        address reviewerAddress; 
        string reviewerMessage; 
    } 
 
 
    struct Hangout { 
        address payable owner; 
        string country; 
        string image; 
        string description; 
        string location; 
        uint price; 
        uint sold; 
        uint numberOfReview; 
    } 
 
    mapping(uint256=> Hangout) internal hangouts; 
    mapping (uint => Review[]) internal reviewsMap;// mapping reviews 
    mapping (uint => mapping(address => bool)) internal hasBought;
 
    modifier validString(string memory input){
        require(bytes(input).length > 0, "invalid input");
        _;
    }
    function addHangout( 
        string memory _country, 
        string memory _image, 
        string memory _description, 
        string memory _location, 
        uint _price 
    )   public
        validString(_country) validString(_image)
        validString(_description) validString(_location)
    {  
        require(_price > 0, "invalid input");
        hangouts[hangoutLength.current()] = Hangout( 
            payable(msg.sender), 
            _country, 
            _image, 
            _description, 
            _location, 
            _price, 
            0, 
            0 
        ); 
        hangoutLength.increment(); 
    } 
 
    function bookHangout(uint _index) public payable  {
        require(msg.sender != hangouts[_index].owner, "owner can't buy");
        require( 
          IERC20Token(cUsdTokenAddress).transferFrom( 
            msg.sender, 
            hangouts[_index].owner, 
            hangouts[_index].price 
          ), 
          "Can not perform transactions." 
        ); 
        hasBought[_index][msg.sender] = true;
    } 
 
    // add a review to a vacation couples hangout 
   function addReview(uint _index, string memory _reviews) public{
        require(hasBought[_index][msg.sender] == true, "only buyers can review");
        reviewsMap[_index].push(Review(_index, address(msg.sender), _reviews)); 
        hangouts[_index].numberOfReview++; 
    } 
 
 
    function getHangoutLength() public view returns(uint){ 
        return hangoutLength.current(); 
    } 
 
    // acquiring length of reviews  
    function getReviewLength(uint _index) public view returns (uint) { 
        return reviewsMap[_index].length; 
    } 

    function getHangout(uint _index)public view returns( 
        address payable, 
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        uint, 
        uint, 
        uint, 
        Review[] memory 
    ){ 
        Hangout memory h = hangouts[_index]; 
        Review[] memory reviews = reviewsMap[_index]; 
        return ( 
            h.owner, 
            h.country, 
            h.image, 
            h.description, 
            h.location, 
            h.price, 
            h.sold,  
            h.numberOfReview, 
            reviews 
        ); 
    } 
}