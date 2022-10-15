// SPDX-License-Identifier: MIT 
 
pragma solidity >=0.7.0 <0.9.0; 
 
 
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
 
    uint internal hangoutLength = 0; 
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; 
 
 
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
 
 
    function addHangout( 
        string memory _country, 
        string memory _image, 
        string memory _description, 
        string memory _location, 
        uint _price 
    )public{ 
        uint _sold = 0; 
        uint _numberOfReview = 0; 
 
 
        hangouts[hangoutLength] = Hangout( 
            payable(msg.sender), 
            _country, 
            _image, 
            _description, 
            _location, 
            _price, 
            _sold, 
            _numberOfReview 
        ); 
        hangoutLength++; 
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
 
 
 
       // add a review to a vacation couples hangout 
   function addReview(uint _index, string memory _reviews) public{ 
    reviewsMap[_index].push(Review(_index, address(msg.sender), _reviews)); 
    hangouts[_index].numberOfReview++; 
  } 
 
 
function bookHangout(uint _index) public payable  { 
        require( 
          IERC20Token(cUsdTokenAddress).transferFrom( 
            msg.sender, 
            hangouts[_index].owner, 
            hangouts[_index].price 
          ), 
          "Can not perform transactions." 
        ); 
    } 
 
    function getHangoutLength() public view returns(uint){ 
        return hangoutLength; 
    } 
 
    // acquiring length of reviews  
    function getReviewLength(uint _index) public view returns (uint) { 
        return reviewsMap[_index].length; 
    } 
}